// Opt-in research probe. No production endpoint and no customer data required.
import {chromium} from 'playwright';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {zipSync,strToU8,unzipSync} from 'fflate';
import {parseAlbumUrl} from '../src/album-url.js';
const endpoint=process.env.PHOTOREPORT_CDP_ENDPOINT;
const album=process.env.PHOTOREPORT_TEST_ALBUM;
const output=process.env.PHOTOREPORT_TEST_OUTPUT;
if(album&&!output)throw new Error('Specify PHOTOREPORT_TEST_OUTPUT for an authorized synthetic test album.');
const temp=await mkdtemp(join(tmpdir(),'photoreport-probe-'));
let browser;
try{
 browser=endpoint?await chromium.connectOverCDP(endpoint):await chromium.launch({headless:true});
 const context=await browser.newContext({acceptDownloads:true});
 const page=await context.newPage();
 const fixture=zipSync({'fixture.txt':strToU8('PhotoReport download probe')});
 await page.setContent('<a id="fixture" download="synthetic.zip" href="data:application/zip;base64,'+Buffer.from(fixture).toString('base64')+'">Download fixture</a>');
 const [dl]=await Promise.all([page.waitForEvent('download',{timeout:15000}),page.locator('#fixture').click()]);
 const target=join(temp,'fixture.zip');await dl.saveAs(target);
 const bytes=await readFile(target);if(!Buffer.from(fixture).equals(bytes))throw new Error('Synthetic download byte mismatch');
 console.log('PASS: synthetic ZIP download and retrieval');
 if(album){
  const url=parseAlbumUrl(album);
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  if(new URL(page.url()).hostname!=='photos.google.com')throw new Error('Album did not resolve to Google Photos; stop, do not bypass sign-in.');
  // UI labels may vary; fail closed rather than clicking arbitrary controls.
  const menu=page.getByRole('button',{name:/^(more options|more actions|more)$/i});
  if(await menu.count()!==1)throw new Error('Album menu not uniquely identified; manual download required.');
  await menu.click({timeout:10000});
  const item=page.getByText('Download all',{exact:true});
  if(await item.count()!==1)throw new Error('Download all unavailable; manual download required.');
  const [archive]=await Promise.all([page.waitForEvent('download',{timeout:120000}),item.click({timeout:10000})]);
  const path=join(temp,'album.zip');await archive.saveAs(path);
  const result=await readFile(path);if(result.length>20*1024*1024)throw new Error('Use a smaller synthetic test album (20 MB max).');
  if(!Object.keys(unzipSync(result)).length)throw new Error('Empty ZIP');
  await writeFile(output,result,{flag:'wx'});
  console.log('PASS: authorized synthetic album ZIP retrieved');
 }
 await context.close();
}catch(err){console.error('Probe failed:',err.name,'— inspect browser/download support locally; no credentials or album URLs logged.');process.exitCode=1}
finally{if(browser)await browser.close().catch(()=>{});await rm(temp,{recursive:true,force:true})}
