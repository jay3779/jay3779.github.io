/**
 * Encoder Module
 * Compresses markdown into itty-bitty format
 */

import * as zlib from 'zlib';

export interface EncodingResult {
  url: string;
  compressedSize: number;
  rawSize: number;
  compressionRatio: string;
}

function getBaseUrl(): string {
  return process.env.ITTY_BLOG_BASE_URL || 'https://how.bitty.site';
}

export function encodeMarkdown(
  markdown: string,
  title: string = ''
): EncodingResult {
  const rawSize = Buffer.byteLength(markdown, 'utf8');

  // Size validation
  if (rawSize > 32768) {
    throw new Error(
      `Content too large: ${rawSize} bytes (max 32KB). ` +
      `Typical blog post should be under 4KB compressed.`
    );
  }

  // Compress
  const compressed = zlib.deflateSync(markdown);
  const compressedSize = compressed.length;

  // Warn about social media limits
  if (compressedSize > 4000) {
    console.warn(
      `⚠️ Compressed size ${compressedSize}b may exceed social media limits (optimal: <4KB)`
    );
  }

  // Encode to base64url
  const base64url = compressed
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // Build URL
  const titleEncoded = encodeURIComponent(title.slice(0, 50));
  const url = `${getBaseUrl()}/#${titleEncoded}/${base64url}`;

  return {
    url,
    compressedSize,
    rawSize,
    compressionRatio: ((1 - compressedSize / rawSize) * 100).toFixed(1)
  };
}
