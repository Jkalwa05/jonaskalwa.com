import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
async function walk(dir){const items=await fs.readdir(dir,{withFileTypes:true});return(await Promise.all(items.map(i=>i.isDirectory()?walk(path.join(dir,i.name)):path.join(dir,i.name)))).flat()}
const files = await walk(root);
const htmlFiles = files.filter(p=>p.endsWith('.html'));
let failures=[];
for(const file of htmlFiles){
  const source=await fs.readFile(file,'utf8');
  if(!/<html[^>]*lang="de"/.test(source))failures.push(`${file}: missing language`);
  if((source.match(/<h1[\s>]/g)||[]).length!==1)failures.push(`${file}: expected one h1`);
  for(const [,ref] of source.matchAll(/(?:src|href)="([^"]+)"/g)){
    if(/^(https?:|mailto:|tel:|data:)/.test(ref))continue;
    const [pathname,hash]=ref.split('#');
    let target=pathname?path.resolve(pathname.startsWith('/')?root:path.dirname(file),pathname.replace(/^\//,'')):file;
    const stat=await fs.stat(target).catch(()=>null);
    if(stat?.isDirectory())target=path.join(target,'index.html');
    if(!await fs.stat(target).catch(()=>null)){failures.push(`${path.relative(root,file)}: broken reference ${ref}`);continue}
    if(hash&&target.endsWith('.html')){const content=await fs.readFile(target,'utf8');if(!content.includes(`id="${hash}"`))failures.push(`${file}: missing anchor ${ref}`)}
  }
}
const main=await fs.readFile(path.join(root,'index.html'),'utf8');
for(const text of ['ak-website-desktop.webp','ak-visitenkarten-foto.webp','jonas-kalwa.webp','IBM AI Developer','Seit November 2026','id="lebenslauf"'])if(!main.includes(text))failures.push(`Missing requirement: ${text}`);
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`Static build: ${htmlFiles.length} HTML pages checked; all local assets, links and anchors resolve.`);
