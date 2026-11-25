import {defineConfig} from 'vite';
import {readdirSync,writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
export default defineConfig({plugins:[{name:'offline-shell',closeBundle(){
 const assets=readdirSync('dist/assets').map(x=>'/assets/'+x);
 const list=['/','/index.html','/manifest.webmanifest','/icon.svg',...assets];
 const version=createHash('sha256').update(list.map(p=>p==='/'?'':readFileSync('dist'+p)).map(x=>Buffer.from(x)).reduce((a,b)=>Buffer.concat([a,b]),Buffer.alloc(0))).digest('hex').slice(0,16);
 writeFileSync(join('dist','sw.js'),`
 const CACHE='photoreport-${version}';const FILES=${JSON.stringify(list)};
 self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
 self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('photoreport-')&&k!==CACHE).map(k=>caches.delete(k))))));
 self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.open(CACHE).then(c=>c.match('/index.html'))));return}
  e.respondWith(caches.open(CACHE).then(c=>c.match(e.request)).then(r=>r||fetch(e.request)));
 });
 `);
}}]});
