const zlib = require('zlib');

// Lorem Ipsum HTML
const html = `<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Lorem Ipsum Test</title><style>body{font-family:sans-serif;max-width:800px;margin:0 auto;padding:20px;line-height:1.6;color:#333}h1{color:#0066cc;border-bottom:2px solid #0066cc;padding-bottom:10px}h2{margin-top:30px}.meta{color:#666;font-size:0.9em;margin-bottom:20px}ul{padding-left:20px}hr{margin:30px 0}</style></head><body><h1>Lorem Ipsum Test</h1><div class="meta">Verification post for self-hosted decoder</div><p><strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><h2>Verification</h2><p>If you can read this, the decoder works! ✅</p><ul><li>Content is compressed with DEFLATE</li><li>Decompression happens in browser</li><li>Self-hosted on GitHub Pages</li><li>No external decoder needed</li></ul><hr><p style="text-align:center;color:#999;font-size:0.85em">Lorem Ipsum test post • Self-hosted decoder verification</p></body></html>`;

// Compress
const compressed = zlib.deflateSync(html);

// Base64url encode
const b64 = compressed.toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '');

const title = encodeURIComponent('Lorem Ipsum Test');
const url = `https://jay3779.github.io/decoder.html#${title}/${b64}`;

console.log('\n✅ Test Post URL Generated\n');
console.log('Original: ' + html.length + ' bytes');
console.log('Compressed: ' + compressed.length + ' bytes');
console.log('Ratio: ' + ((1 - compressed.length/html.length)*100).toFixed(1) + '%\n');
console.log('URL:\n' + url);
