import test from 'node:test';
import assert from 'node:assert/strict';
import {parseAlbumUrl} from '../src/album-url.js';
test('accepts Google Photos album links and preserves sharing keys',()=>{
  for(const url of ['https://photos.app.goo.gl/Abc123','https://photos.google.com/share/AF1QipExample?key=abc','https://photos.google.com/u/1/album/AF1QipExample']) assert.equal(parseAlbumUrl(' '+url+' '),url);
});
test('rejects spoofed hosts, credentials, non-album URLs and unsafe protocols',()=>{
  for(const url of ['https://photos.app.goo.gl.evil.example/abc','https://photos.google.com@evil.example/share/abc','https://user@photos.google.com/share/abc','http://photos.app.goo.gl/abc','javascript:alert(1)','https://photos.google.com/photo/abc','https://photos.google.com/share/','https://photos.app.goo.gl/abc/other']) assert.throws(()=>parseAlbumUrl(url));
});
