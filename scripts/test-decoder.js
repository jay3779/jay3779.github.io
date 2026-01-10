#!/usr/bin/env node

const zlib = require('zlib');

const title = 'Lorem Ipsum Decoder Test';
const html = `<h1>Lorem Ipsum Decoder Test</h1>
<p>This is a test post to verify the self-hosted decoder is working correctly.</p>

<h2>What is Lorem Ipsum?</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

<h2>Why Use It?</h2>
<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

<h2>Testing Compression</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

<footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; color: #888; font-size: 0.9em;">
  <p>✅ If you're reading this, the self-hosted decoder is working!</p>
</footer>`;

// Compress using gzip (same as itty-bitty)
const compressed = zlib.deflateSync(html);
const base64 = compressed.toString('base64');

// Create the URL
const titleEncoded = encodeURIComponent(title);
const decoderUrl = `https://jay3779.github.io/decoder.html#${titleEncoded}/${base64}`;

console.log('📝 Test Post Created!');
console.log('='.repeat(80));
console.log('Title:', title);
console.log('Original size:', html.length, 'bytes');
console.log('Compressed size:', compressed.length, 'bytes');
console.log('Compression ratio:', (100 * (1 - compressed.length / html.length)).toFixed(1) + '%');
console.log('');
console.log('🔗 Decoder URL:');
console.log(decoderUrl);
console.log('');
console.log('📋 Copy the URL above and test in browser!');
