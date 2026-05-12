const fs = require('fs');
const zlib = require('zlib');

const content = fs.readFileSync('c:/Itty Blog/blog-repo/posts/markdown-render-test.md', 'utf8');
const compressed = zlib.deflateSync(content);
const base64url = compressed.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
console.log('http://127.0.0.1:8081/decoder.html#Markdown%20Rendering%20Test/' + base64url);
