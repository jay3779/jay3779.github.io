/**
 * Generate OG Preview Images using Satori
 * Creates 1200x630px PNG images for social media sharing
 * 
 * Requires: npm install satori sharp
 */

const fs = require('fs');
const path = require('path');

/**
 * Note: Satori requires complex setup with fonts.
 * For MVP, create placeholder PNG images.
 * Full implementation requires:
 * - npm install satori sharp
 * - Roboto font files
 * - JSX→PNG rendering
 */
async function generateOGImages() {
  const postsPath = path.join(__dirname, '../posts/index.json');
  
  if (!fs.existsSync(postsPath)) {
    console.log('⚠️  No posts index found. Skipping OG image generation.');
    return;
  }

  const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
  const ogDir = path.join(__dirname, '../docs/og-images');

  // Ensure directory exists
  if (!fs.existsSync(ogDir)) {
    fs.mkdirSync(ogDir, { recursive: true });
  }

  console.log(`Generating ${posts.length} OG preview images...`);

  // For MVP: Create placeholder SVG/PNG
  // Full production requires:
  // 1. npm install satori sharp @resvg/resvg-js
  // 2. Font setup with Roboto TTF
  // 3. JSX template rendering
  
  for (const post of posts) {
    const slug = post.title.toLowerCase().replace(/\s+/g, '-').slice(0, 30);
    const imagePath = path.join(ogDir, `${slug}.png`);
    
    // Create placeholder (in production, use Satori)
    createPlaceholderImage(imagePath, post.title);
  }

  console.log(`✅ Generated OG images in ${ogDir}`);
}

/**
 * Placeholder: Create minimal SVG → PNG
 * In production, replace with Satori
 */
function createPlaceholderImage(filePath, title) {
  // For now, create a minimal SVG file as placeholder
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grad)"/>
  <text x="50" y="315" font-size="60" font-weight="bold" fill="white" font-family="Arial">
    ${escapeXml(title.substring(0, 50))}
  </text>
  <text x="50" y="570" font-size="24" fill="white" opacity="0.8" font-family="Arial">
    itty-bitty blog
  </text>
</svg>`;

  fs.writeFileSync(filePath.replace('.png', '.svg'), svg, 'utf8');
  console.log(`  Created placeholder: ${path.basename(filePath)}`);
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Run if called directly
if (require.main === module) {
  generateOGImages().catch(err => {
    console.error(`❌ Error generating OG images: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { generateOGImages };
