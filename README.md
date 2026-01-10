# 🔗 Itty-Bitty Blog

A minimalist blog platform that encodes posts into shareable URLs using compression and Base64 encoding. Posts are stored as itty-bitty URLs, published to GitHub Pages, with pre-generated social media preview images.

## Architecture

```
┌─────────────────────────────────┐
│  VS Code Extension + MCP Tool   │
│  (Create posts from chat)       │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Markdown → zlib compress       │
│  → Base64 encode itty-bitty URL │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Git commit with metadata       │
│  Push to GitHub                 │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  GitHub Actions Workflow        │
│  - Parse commit metadata        │
│  - Generate OG preview images   │
│  - Update blog index            │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  GitHub Pages                   │
│  Blog with social share buttons │
└─────────────────────────────────┘
```

## Setup

### Prerequisites

- Node.js 16+
- Git
- GitHub account
- VS Code (for extension)

### Installation

1. Clone repository
```bash
git clone <your-blog-repo>
cd blog-repo
npm install
```

2. Test encoder
```bash
npm test
```

3. Encode a post
```bash
node scripts/encoder.js path/to/post.md "Post Title"
```

## Usage

### Manual Encoding

```bash
# Encode markdown file
node scripts/encoder.js my-post.md "My Post Title"

# Output:
# 🔗 URL: https://how.bitty.site/#My%20Post%20Title/[encoded_content]
```

### Via VS Code Extension

1. Install the itty-bitty blog extension from VS Code Marketplace
2. Open Copilot Chat
3. Invoke tool: `@ittyBlog Create blog post from this markdown`
4. Paste markdown → Extension encodes → URL auto-committed → Deployed

### Programmatic Use

```javascript
const { encodeMarkdown } = require('./scripts/encoder');

const markdown = '# My Post\n\nContent here...';
const result = encodeMarkdown(markdown, 'My Post');

console.log(result.url);  // Shareable URL
```

## File Structure

```
blog-repo/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions workflow
├── scripts/
│   ├── encoder.js              # Core compression/encoding
│   ├── build-index.js          # Generate blog index HTML
│   └── test-encoder.js         # Test suite
├── posts/
│   └── index.json              # Post metadata index
├── docs/                       # GitHub Pages root
│   ├── index.html              # Blog homepage
│   └── og-images/              # Pre-generated preview images
└── package.json
```

## Workflow

### Creating a Post

1. **Write markdown** in VS Code or chat UI
2. **Extension encodes** via `zlib.deflateSync()` + Base64
3. **Commit created** with metadata: `blog: [itty:url_payload]`
4. **Push to GitHub** triggers Actions workflow
5. **Actions extracts** URL from commit message
6. **Satori generates** OG preview image (1200x630px)
7. **Index rebuilt** with new post
8. **GitHub Pages deployed** with social share buttons

### Sharing a Post

Each post has a shareable itty-bitty URL that includes:
- Post title in URL fragment
- Compressed markdown content (client-side decompressed)
- Social media preview image (OG meta tags)
- Share buttons (Twitter, LinkedIn, Copy)

## Size Limits

- **Hard limit**: 32 KB (browser)
- **Practical limit**: ~4 KB compressed (for social media sharing)
- **Typical post**: 500–1000 words

## Limitations

- ⚠️ URLs are immutable (editing creates new URL)
- ⚠️ Not SEO-indexed (content in URL fragment)
- ⚠️ Limited to simple hypermedia content
- ✅ No database required
- ✅ No backend needed
- ✅ 100% static hosting (GitHub Pages)

## GitHub Actions Setup

Workflows automatically:
1. Parse commit messages for itty-bitty URLs
2. Generate preview images via Satori (HTML→PNG)
3. Update blog index with new posts
4. Deploy to GitHub Pages

See `.github/workflows/deploy.yml` for configuration.

## Extension Development

See `../vscode-itty-extension/` for VS Code extension source.

Features:
- MCP tool for Copilot Chat
- One-click post creation
- Auto-commit to repository
- Real-time error feedback

## License

MIT

## Contributing

Contributions welcome! Please:
1. Test encoder before submitting
2. Keep post size under 4KB compressed
3. Update blog index after commits

---

**Questions?** Open an issue or check the [htmx-discussion.md](../htmx-discussion.md) for architecture notes.
