/**
 * Test Encoder
 * Quick test of encoding functionality
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const zlib = require('zlib');
const { encodeMarkdown } = require('./encoder');

const testMarkdown = `# Welcome to Itty-Bitty Blog

This is a **test post** demonstrating the compression capability.

## Features

- Shareable URLs
- No database required
- GitHub Pages compatible
- Programmatic creation

## Code Example

\`\`\`javascript
const compressed = zlib.deflateSync(markdown);
\`\`\`

That's all for now!
`;

console.log('Testing encoder...\n');

try {
  const result = encodeMarkdown(testMarkdown, 'Test Post');
  console.log('✅ Encoding successful!');
  console.log(`\nURL: ${result.url}`);
  console.log(`\nStats:`);
  console.log(`  Raw size: ${result.rawSize} bytes`);
  console.log(`  Compressed: ${result.compressedSize} bytes`);
  console.log(`  Ratio: ${result.compressionRatio}%`);

  // Verify decoder base64url handling
  const decoderHtml = fs.readFileSync(path.join(__dirname, '..', 'decoder.html'), 'utf8');
  const fnMatch = decoderHtml.match(/function base64ToUint8Array\([^)]*\)\s*\{[\s\S]*?return bytes;\s*}/);

  if (!fnMatch) {
    throw new Error('Decoder base64ToUint8Array function not found');
  }

  const sandbox = {
    atob: (b64) => Buffer.from(b64, 'base64').toString('binary'),
    Uint8Array
  };

  vm.runInNewContext(fnMatch[0] + ';this.base64ToUint8Array = base64ToUint8Array;', sandbox);

  const base64ToUint8Array = sandbox.base64ToUint8Array;
  const hash = result.url.split('#')[1];
  const compressedB64 = hash.split('/').slice(1).join('/');
  const decoded = zlib.inflateSync(base64ToUint8Array(compressedB64)).toString('utf8');

  assert.strictEqual(decoded, testMarkdown);
  console.log('\n✅ Decoder base64url handling verified!');
} catch (error) {
  console.error(`❌ Test failed: ${error.message}`);
  process.exit(1);
}
