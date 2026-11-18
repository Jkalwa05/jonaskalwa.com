import fs from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const source=JSON.parse(await fs.readFile(new URL('brand/tokens.json',root),'utf8'));
const entries=new Map();
function walk(node,path=[]){
 if(node&&typeof node==='object'&&'$value'in node){entries.set(path.join('.'),{...node,name:node.$extensions?.css?.name||path.join('-')});return}
 for(const [key,value]of Object.entries(node))if(!key.startsWith('$'))walk(value,[...path,key]);
}
walk(source);
// Validate the entire reference graph, including aliases that CSS would silently drop.
const verified=new Set();
function validate(key,path=[]){
 if(path.includes(key))throw new Error(`Token cycle: ${[...path,key].join(' → ')}`);
 if(verified.has(key))return;
 const token=entries.get(key);if(!token)throw new Error(`Missing token ${key}`);
 for(const match of String(token.$value).matchAll(/\{([^}]+)\}/g))validate(match[1],[...path,key]);
 verified.add(key);
}
for(const key of entries.keys())validate(key);
function css(token){
 const v=token.$value;
 if(typeof v==='object'&&'value'in v)return `${v.value}${v.unit}`;
 return String(v).replace(/\{([^}]+)\}/g,(_,key)=>{const target=entries.get(key);if(!target)throw new Error(`Missing token ${key}`);return `var(--${target.name})`});
}
const fonts=await fs.readFile(new URL('brand/font-faces.css',root),'utf8');
const output=`/* Generated from brand/tokens.json. Edit the source, then npm run build. */\n${fonts}\n:root{\n color-scheme:light;\n${[...entries.values()].map(t=>` --${t.name}:${css(t)};`).join('\n')}\n}\n`;
await fs.writeFile(new URL('dist/tokens.css',root),output);
console.log(`Design tokens: ${entries.size} primitives, semantic roles and component tokens generated.`);
