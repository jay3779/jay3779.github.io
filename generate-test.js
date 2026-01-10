const zlib = require('zlib');
const fs = require('fs');

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

// Compress and encode
const compressed = zlib.deflateSync(html);
const base64 = compressed.toString('base64');

// Save to file for reference
const output = {
  title,
  htmlSize: html.length,
  compressedSize: compressed.length,
  ratio: (100 * (1 - compressed.length / html.length)).toFixed(1) + '%',
  base64,
  decoderUrl: `https://jay3779.github.io/decoder.html#${encodeURIComponent(title)}/${base64}`
};

console.log(JSON.stringify(output, null, 2));
fs.writeFileSync('./test-post.json', JSON.stringify(output, null, 2));
