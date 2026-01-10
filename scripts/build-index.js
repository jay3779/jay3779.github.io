/**
 * Build Blog Index
 * Generates HTML index from posts directory
 * Reads commit metadata to extract itty-bitty URLs
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate blog index HTML
 * @param {Array} posts - Array of post objects with title, url, description, date
 */
function generateIndexHTML(posts) {
  const postsHTML = posts
    .map(post => {
      // Ensure post uses local decoder
      const hash = post.url.includes('#') ? post.url.split('#')[1] : post.url;
      const localUrl = `/decoder.html#${hash}`;
      
      return `
    <article class="post-card">
      <h2><a href="${localUrl}">${post.title}</a></h2>
      <p class="description">${post.description || 'No description'}</p>
      <p class="meta">
        <time>${post.date}</time>
        <span class="compression">${post.compressedSize} bytes</span>
      </p>
      <div class="share-buttons">
        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent('https://jay3779.github.io' + localUrl)}&text=${encodeURIComponent(post.title)}" 
           class="share-btn twitter" target="_blank">
          Twitter
        </a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://jay3779.github.io' + localUrl)}" 
           class="share-btn linkedin" target="_blank">
          LinkedIn
        </a>
        <button class="share-btn copy" data-url="https://jay3779.github.io${localUrl}">
          Copy Link
        </button>
      </div>
    </article>
    `;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Itty-Bitty Blog</title>
  <meta property="og:title" content="Itty-Bitty Blog">
  <meta property="og:description" content="Blog platform using shareable compressed URLs">
  <meta property="og:image" content="/og-images/index.png">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      color: white;
      margin-bottom: 50px;
    }
    header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    header p {
      font-size: 1.1em;
      opacity: 0.9;
    }
    .posts {
      display: grid;
      gap: 30px;
    }
    .post-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .post-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }
    .post-card h2 {
      margin-bottom: 15px;
    }
    .post-card h2 a {
      color: #667eea;
      text-decoration: none;
    }
    .post-card h2 a:hover {
      text-decoration: underline;
    }
    .description {
      color: #555;
      margin-bottom: 15px;
      line-height: 1.6;
    }
    .meta {
      font-size: 0.9em;
      color: #888;
      margin-bottom: 20px;
    }
    .meta time {
      margin-right: 20px;
    }
    .compression {
      background: #f0f0f0;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .share-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .share-btn {
      flex: 1;
      min-width: 120px;
      padding: 10px 15px;
      border: none;
      border-radius: 6px;
      font-size: 0.9em;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      text-align: center;
      transition: all 0.2s;
    }
    .share-btn.twitter {
      background: #1DA1F2;
      color: white;
    }
    .share-btn.twitter:hover {
      background: #1a8cd8;
    }
    .share-btn.linkedin {
      background: #0A66C2;
      color: white;
    }
    .share-btn.linkedin:hover {
      background: #084399;
    }
    .share-btn.copy {
      background: #667eea;
      color: white;
    }
    .share-btn.copy:hover {
      background: #5568d3;
    }
    .empty-state {
      text-align: center;
      color: white;
      padding: 60px 20px;
    }
    .empty-state h2 {
      font-size: 1.8em;
      margin-bottom: 10px;
    }
    
    /* Toast Notifications */
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 350px;
    }
    .toast {
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      animation: slideIn 0.3s ease-out;
      min-height: 50px;
    }
    @keyframes slideIn {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .toast-icon { font-size: 20px; }
    .toast-message { color: #333; font-weight: 500; font-size: 0.95em; }
    .toast.fade-out {
      animation: slideOut 0.3s ease-out forwards;
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(120%); opacity: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🔗 Itty-Bitty Blog</h1>
      <p>Shareable posts in URLs</p>
    </header>
    
    <div class="posts">
      ${postsHTML || '<div class="empty-state"><h2>No posts yet</h2><p>Check back soon!</p></div>'}
    </div>
  </div>

  <div class="toast-container" id="toastContainer"></div>

  <script>
    function showToast(message, icon = '✅') {
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = '<span class="toast-icon">' + icon + '</span><span class="toast-message">' + message + '</span>';
      container.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('copy')) {
        const url = e.target.getAttribute('data-url');
        navigator.clipboard.writeText(url).then(() => {
          showToast('Link copied to clipboard!');
        });
      }
    });

    // Handle toast messages if redirected back from elsewhere
    const params = new URLSearchParams(window.location.search);
    if (params.has('shared')) showToast('Post shared successfully!');
  </script>
</body>
</html>`;
}

/**
 * Parse post metadata from JSON file
 */
function loadPosts() {
  const postsDir = path.join(__dirname, '../posts');
  const indexPath = path.join(postsDir, 'index.json');

  if (!fs.existsSync(indexPath)) {
    return [];
  }

  try {
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    return Array.isArray(index) ? index : [];
  } catch (error) {
    console.error(`Error reading posts index: ${error.message}`);
    return [];
  }
}

/**
 * Build and write index
 */
function buildIndex() {
  const posts = loadPosts();
  const html = generateIndexHTML(posts);
  const outputPath = path.join(__dirname, '../docs/index.html');

  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`✅ Blog index generated: ${outputPath}`);
  console.log(`📝 Total posts: ${posts.length}`);
}

if (require.main === module) {
  buildIndex();
}

module.exports = { generateIndexHTML, loadPosts };
