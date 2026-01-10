/**
 * Test Encoder
 * Quick test of encoding functionality
 */

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
} catch (error) {
  console.error(`❌ Test failed: ${error.message}`);
  process.exit(1);
}
