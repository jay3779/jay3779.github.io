const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const postPath = path.join(__dirname, 'posts', 'markdown-render-test.md');
const outPath = path.join(__dirname, 'url-output.txt');

const content = fs.readFileSync(postPath, 'utf8');
const compressed = zlib.deflateSync(content);
const base64url = compressed.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
const url = 'http://127.0.0.1:8081/decoder.html#Markdown%20Rendering%20Test/' + base64url;
fs.writeFileSync(outPath, url);
console.log(url);
