import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const kit = process.env.UX_KIT_DIR || path.join(homedir(), '.codex/plugins/cache/ux-stack-local/ux-stack/1.1.0/kits/ux-ui-agent-skills');
const kitRequire = createRequire(path.join(kit,'package.json'));
let chromium, axePath;
try { ({chromium}=require('playwright')); axePath=require.resolve('axe-core/axe.min.js'); }
catch { ({chromium}=kitRequire('playwright')); axePath=kitRequire.resolve('axe-core/axe.min.js'); }
const origin = process.env.TEST_URL || 'http://127.0.0.1:4173';
const shots = path.join(root,'qa/screenshots');
await fs.mkdir(shots,{recursive:true});
const browser = await chromium.launch({executablePath:process.env.CHROME_PATH||undefined,headless:true});
const results = {origin, responsive:[], accessibility:[], functional:[], fallback:[], consoleErrors:[], metrics:[]};
try {
  for (const width of [320,390,768,1024,1440]) {
    const page=await browser.newPage({viewport:{width,height:width<640?844:900},deviceScaleFactor:1});
    page.on('pageerror',error=>results.consoleErrors.push(error.message));
    await page.addInitScript(()=>{window.__metrics={cls:0,lcp:0};try{new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__metrics.cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())window.__metrics.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true})}catch{}});
    const response=await page.goto(origin,{waitUntil:'networkidle'});
    assert.equal(response.status(),200);
    await page.evaluate(()=>document.fonts.ready);
    await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>{})}))});
    await page.waitForTimeout(900);
    const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),momentFailed:document.querySelector('[data-moment-failed]')?.dataset.momentFailed||null}));
    assert.ok(layout.scroll<=width,`Horizontal overflow at ${width}: ${layout.scroll}`);
    assert.deepEqual(layout.broken,[],`Broken images at ${width}`);
    assert.equal(layout.momentFailed,null,'Moment failed to mount');
    results.responsive.push({...layout,passed:true});
    await page.screenshot({path:path.join(shots,`home-${width}.png`),fullPage:true});
    await page.screenshot({path:path.join(shots,`hero-${width}.png`)});
    if(width===390||width===1440){
      await page.addScriptTag({path:axePath});
      const a11y=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
      results.accessibility.push({width,violations:a11y.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});
      assert.deepEqual(a11y.violations,[],`axe violations at ${width}: ${JSON.stringify(results.accessibility.at(-1))}`);
      // Contact content must create the selected subject and retain the visitor's text.
      await page.getByLabel('Automatisierung',{exact:true}).check();
      await page.getByLabel('Was brauchst du?').fill('Daten von meinem Formular in meine Kundenliste übertragen.');
      const mailto=await page.evaluate(()=>new Promise(resolve=>{const form=document.querySelector('.project-form');form.addEventListener('submit',()=>{queueMicrotask(()=>resolve({interest:new FormData(form).get('interest'),body:new FormData(form).get('body'),status:form.querySelector('[role=status]').textContent}))},{once:true});form.requestSubmit()}));
      assert.equal(mailto.interest,'Automatisierung & KI');
      assert.match(mailto.body,/Kundenliste/);
      assert.match(mailto.status,/Mailprogramm/);
      results.functional.push({width,check:'mail draft selects interest, retains input and avoids fake sent confirmation',passed:true});
      await page.locator('.service').nth(1).locator('summary').click();
      assert.ok(await page.locator('.service').nth(1).evaluate(el=>el.open));
      await page.locator('.service').nth(1).locator('summary').click();
      assert.equal(await page.locator('.service').nth(1).evaluate(el=>el.open),false);
      await page.goto(origin+'/#lebenslauf',{waitUntil:'networkidle'});
      assert.ok(await page.locator('#lebenslauf').evaluate(el=>el.open));
      await page.locator('#lebenslauf').scrollIntoViewIfNeeded();
      await page.screenshot({path:path.join(shots,`cv-${width}.png`)});
      assert.match(await page.locator('#lebenslauf').innerText(),/September 2026/);
      results.functional.push({width,check:'service disclosures, CV deep link, latest career content',passed:true});
      if(width===390){
        await page.goto(origin,{waitUntil:'networkidle'});
        await page.getByRole('button',{name:'Menü öffnen'}).click();
        assert.equal(await page.getByRole('button',{name:'Menü schließen'}).getAttribute('aria-expanded'),'true');
        await page.keyboard.press('Escape');
        assert.equal(await page.getByRole('button',{name:'Menü öffnen'}).getAttribute('aria-expanded'),'false');
        assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('menu-toggle')),true);
        await page.keyboard.press('Tab');
        await page.screenshot({path:path.join(shots,'keyboard-390.png')});
        results.functional.push({width,check:'mobile menu, Escape and focus return',passed:true});
      }
    }
    results.metrics.push({width,...await page.evaluate(()=>window.__metrics)});
    await page.close();
  }
  for(const pathname of ['/impressum/','/datenschutz/','/404.html']){
    const page=await browser.newPage({viewport:{width:390,height:844}});
    await page.goto(origin+pathname,{waitUntil:'networkidle'});
    await page.addScriptTag({path:axePath});
    const violations=await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}})).violations);
    assert.equal(violations.length,0,`${pathname}: ${JSON.stringify(violations)}`);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    results.accessibility.push({route:pathname,violations:[]});
    await page.close();
  }
  for(const settings of [{javaScriptEnabled:false},{reducedMotion:'reduce'}]){
    const page=await browser.newPage({viewport:{width:390,height:844},...settings});
    await page.goto(origin,{waitUntil:'networkidle'});
    await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>{})}))});
    assert.ok(await page.locator('h1').isVisible());
    assert.ok(await page.locator('#philosophy-title').isVisible());
    assert.equal(await page.locator('main img').evaluateAll(imgs=>imgs.every(i=>i.naturalWidth>0)),true);
    assert.ok(await page.getByRole('link',{name:'kalwajonas@gmail.com'}).first().getAttribute('href'));
    if(settings.javaScriptEnabled===false){assert.ok(await page.locator('#navigation').isVisible());await page.locator('#lebenslauf summary').click();assert.ok(await page.locator('#lebenslauf').evaluate(el=>el.open));}
    else {const animations=await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length);assert.equal(animations,0);}
    results.fallback.push({settings,passed:true});
    await page.screenshot({path:path.join(shots,settings.javaScriptEnabled===false?'no-js-390.png':'reduced-motion-390.png')});
    await page.close();
  }
  assert.deepEqual(results.consoleErrors,[]);
  results.passed=true;
} catch(error){results.passed=false;results.error=error.message;throw error}
finally {await fs.writeFile(path.join(root,'qa/results.json'),JSON.stringify(results,null,2));await browser.close()}
console.log(JSON.stringify(results,null,2));
