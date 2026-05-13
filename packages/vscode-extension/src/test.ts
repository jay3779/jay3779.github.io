/**
 * Test Extension
 * Quick validation of encoding and git integration
 */

import { encodeMarkdown } from './encoder';

const testMarkdown = `# Welcome to Itty-Bitty

This is a **test post** for the VS Code extension.

## Features

- ✅ Encoded in URL
- ✅ No database
- ✅ Shareable links

## Code

\`\`\`typescript
const url = encodeMarkdown(markdown, 'Title');
\`\`\`

Done!
`;

console.log('🧪 Testing encoder...\n');

try {
  const result = encodeMarkdown(testMarkdown, 'Welcome to Itty-Bitty');
  console.log('✅ Encoding successful!\n');
  console.log('📊 Statistics:');
  console.log(`   Raw size: ${result.rawSize} bytes`);
  console.log(`   Compressed: ${result.compressedSize} bytes`);
  console.log(`   Ratio: ${result.compressionRatio}%`);
  console.log(`\n🔗 URL:\n${result.url}\n`);
} catch (error) {
  console.error(`❌ Test failed: ${(error as Error).message}`);
  process.exit(1);
}
