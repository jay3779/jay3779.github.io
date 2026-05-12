// AAH-CLI Encoder
// This module handles the core compression and encoding logic.
const zlib = require('zlib');

/**
 * Encodes the given text using the specified algorithm.
 * @param {string} text The text to encode.
 * @param {string} algorithm The compression algorithm to use ('gzip').
 * @returns {string} The compressed and base64-encoded string.
 */
function encode(text, algorithm = 'gzip') {
  if (!text) {
    return "";
  }

  let compressed;
  switch (algorithm) {
    case 'gzip':
      compressed = zlib.gzipSync(Buffer.from(text, 'utf-8'));
      break;
    case 'lzma':
      // lzma-native is installed but requires an async refactor to implement properly.
      console.error("LZMA encoding is not implemented in this version.");
      process.exit(1);
      return; // Add return to stop execution in tests
    default:
      console.error(`Unknown algorithm: ${algorithm}`);
      process.exit(1);
      return; // Add return to stop execution in tests
  }

  return compressed.toString('base64');
}

module.exports = { encode };
