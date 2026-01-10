/**
 * Itty-Bitty URL Encoder
 * Compresses markdown text into shareable itty-bitty URLs
 * Usage: node encoder.js <markdown-file> or pipe markdown via stdin
 */

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

/**
 * Compress and encode markdown into itty-bitty format
 * @param {string} markdown - Raw markdown text
 * @param {string} title - Post title for metadata
 * @returns {Object} - { url, size, compressed }
 */
function encodeMarkdown(markdown, title = '') {
  // Size check
  const rawSize = Buffer.byteLength(markdown, 'utf8');
  
  if (rawSize > 32768) {
    throw new Error(
      `Markdown too large: ${rawSize} bytes (max 32KB). ` +
      `For social media sharing, keep under 4KB compressed.`
    );
  }

  // Compress using zlib DEFLATE
  const compressed = zlib.deflateSync(markdown);
  const compressedSize = compressed.length;
  
  // Warn if compressed size exceeds practical limits
  if (compressedSize > 4000) {
    console.warn(
      `⚠️  Compressed size: ${compressedSize} bytes. ` +
      `May not be shareable on social media (optimal: <4000 bytes).`
    );
  }

  // Encode to base64url (URL-safe base64)
  const base64url = compressed
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // Build itty-bitty URL with title
  const titleEncoded = encodeURIComponent(title.slice(0, 50));
  const ittyUrl = `https://how.bitty.site/#${titleEncoded}/${base64url}`;

  return {
    url: ittyUrl,
    compressedSize,
    rawSize,
    compressionRatio: ((1 - compressedSize / rawSize) * 100).toFixed(1)
  };
}

/**
 * Parse command-line arguments or read from stdin
 */
async function main() {
  try {
    let markdown = '';
    let title = '';

    // Check for file argument
    const args = process.argv.slice(2);
    
    if (args.length > 0) {
      // File path provided
      const filePath = args[0];
      title = args[1] || path.basename(filePath, '.md');
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      
      markdown = fs.readFileSync(filePath, 'utf8');
    } else {
      // Read from stdin
      markdown = await readStdin();
      title = 'Blog Post';
    }

    // Encode
    const result = encodeMarkdown(markdown, title);

    // Output results
    console.log('\n📦 Itty-Bitty URL Generated\n');
    console.log(`Title:              ${title}`);
    console.log(`Raw size:           ${result.rawSize} bytes`);
    console.log(`Compressed size:    ${result.compressedSize} bytes`);
    console.log(`Compression ratio:  ${result.compressionRatio}%`);
    console.log(`\n🔗 URL:\n`);
    console.log(result.url);
    console.log('\n✅ Copy the URL above to share or commit to repository\n');

    // Return for MCP/programmatic use
    return result;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Read from stdin
 */
function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
      }
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
  });
}

// Export for use as module
module.exports = { encodeMarkdown };

// Run if called directly
if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
