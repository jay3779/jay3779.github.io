#!/usr/bin/env node

/**
 * Generate test post URL with Lorem Ipsum content
 * Uses the project's own encoder to create compressed URL
 */

const { encodeMarkdown } = require('./scripts/encoder');

// Lorem Ipsum HTML content
const htmlContent = `<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lorem Ipsum Test Post</title>
<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
  color: #333;
}
h1 {
  color: #0066cc;
  border-bottom: 2px solid #0066cc;
  padding-bottom: 10px;
}
.meta {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 20px;
}
</style>
</head>
<body>
<h1>Lorem Ipsum Decoder Test</h1>
<div class="meta">A test post to verify the self-hosted decoder works correctly.</div>

<p><strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

<h2>Section Two</h2>

<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

<p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>

<h2>Verification</h2>

<p>If you're reading this, the decoder is working! ✅</p>

<p>This test post confirms that:</p>
<ul>
<li>HTML content is properly compressed</li>
<li>Decompression works in the decoder</li>
<li>The iframe rendering is functional</li>
<li>Styling is preserved</li>
</ul>

<hr>
<p style="text-align: center; color: #999; font-size: 0.85em;">
  Test post generated successfully • Decoder self-hosted on GitHub Pages
</p>
</body>
</html>`;

try {
  const result = encodeMarkdown(htmlContent, 'Lorem Ipsum Test');
  
  // Generate decoder URL (uses local decoder instead of how.bitty.site)
  const baseURL = 'https://jay3779.github.io/decoder.html#';
  const titleEncoded = encodeURIComponent('Lorem Ipsum Test');
  
  // Get base64url from the itty URL
  const ittyUrl = result.url;
  const encodedData = ittyUrl.split('/').pop();
  
  const decoderUrl = `${baseURL}${titleEncoded}/${encodedData}`;
  
  console.log('\n✅ Test Post Generated Successfully!\n');
  console.log('📊 Compression Statistics:');
  console.log(`   Raw size: ${result.rawSize} bytes`);
  console.log(`   Compressed: ${result.compressedSize} bytes`);
  console.log(`   Ratio: ${result.compressionRatio}%\n`);
  console.log('🔗 Decoder URL:\n');
  console.log(decoderUrl);
  console.log('\n📋 To test:');
  console.log('   1. Copy the URL above');
  console.log('   2. Open it in your browser');
  console.log('   3. Verify the Lorem Ipsum content loads in the decoder\n');
  
} catch (error) {
  console.error('❌ Error generating test post:', error.message);
  process.exit(1);
}
