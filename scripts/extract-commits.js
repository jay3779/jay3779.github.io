/**
 * Extract Post Metadata from Git Commits
 * Parses commit messages to find itty-bitty URL metadata
 * Generates posts/index.json for blog index
 * 
 * Commit message format:
 * blog: [itty:compressed_payload] Title: My Post Title | Desc: Short description
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Parse commit message for itty-bitty metadata
 * Format: [itty:base64_payload] Title: ... | Desc: ...
 */
function parseCommitMetadata(message) {
  // Match [itty:...] pattern
  const ittyMatch = message.match(/\[itty:([^\]]+)\]/);
  if (!ittyMatch) return null;

  const payload = ittyMatch[1];
  
  // Extract title
  const titleMatch = message.match(/Title:\s*([^|]+)/);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

  // Extract description
  const descMatch = message.match(/Desc:\s*([^|]+)/);
  const description = descMatch ? descMatch[1].trim() : '';

  // Estimate compressed size from payload
  const compressedSize = Buffer.from(payload, 'base64').length;

  // Build URL
  const titleEncoded = encodeURIComponent(title.slice(0, 50));
  const url = `https://how.bitty.site/#${titleEncoded}/${payload}`;

  return {
    title,
    description,
    url,
    compressedSize,
    date: new Date().toISOString().split('T')[0]
  };
}

/**
 * Get all commits with itty-bitty metadata
 */
function extractPostsFromGit() {
  try {
    // Get all commits that mention [itty:
    const commits = execSync(
      'git log --all --grep="\\[itty:" --pretty=format:"%B%n---COMMIT_END---"',
      { encoding: 'utf8' }
    ).split('---COMMIT_END---');

    const posts = commits
      .map(commit => parseCommitMetadata(commit))
      .filter(post => post !== null)
      .reverse(); // Oldest first, newest last

    return posts;
  } catch (error) {
    console.warn(`⚠️  Git extraction failed (first build?): ${error.message}`);
    return [];
  }
}

/**
 * Merge with existing index
 */
function buildPostIndex() {
  const newPosts = extractPostsFromGit();
  
  // Load existing index
  const indexPath = path.join(__dirname, '../posts/index.json');
  let existingPosts = [];
  
  if (fs.existsSync(indexPath)) {
    try {
      existingPosts = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    } catch (error) {
      console.warn(`⚠️  Could not parse existing index: ${error.message}`);
    }
  }

  // Merge: new posts first (to catch updates), then existing
  const merged = [...newPosts];
  const urls = new Set(newPosts.map(p => p.url));
  
  existingPosts.forEach(post => {
    if (!urls.has(post.url)) {
      merged.push(post);
    }
  });

  return merged;
}

/**
 * Main: Extract and output JSON
 */
function main() {
  const posts = buildPostIndex();
  
  // Output JSON to stdout for GitHub Actions
  console.log(JSON.stringify(posts, null, 2));
  
  // Also save to file
  const indexPath = path.join(__dirname, '../posts/index.json');
  fs.writeFileSync(indexPath, JSON.stringify(posts, null, 2), 'utf8');
  
  if (posts.length > 0) {
    console.error(`\n✅ Extracted ${posts.length} posts from commits`);
  } else {
    console.error(`\n⚠️  No posts found in commits`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { parseCommitMetadata, extractPostsFromGit };
