# VS Code Extension: Itty-Bitty Blog

Create shareable blog posts directly from VS Code chat.

## Features

- 🔗 Encodes markdown into shareable URLs
- 💬 MCP tool for Copilot Chat
- ⚡ One-click GitHub commit & deploy
- 📊 Size validation with compression stats
- 🎯 Right-click encoding context menu

## Installation

### From Marketplace (Coming Soon)

1. Open VS Code Extensions
2. Search for "Itty-Bitty Blog"
3. Install & reload

### From Source

```bash
npm install
npm run build
code --install-extension vscode-itty-blog-0.1.0.vsix
```

## Usage

### Via Command Palette

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P`)
2. Type `Create Itty-Bitty Blog Post`
3. Paste markdown
4. Add title
5. Choose: Copy URL, Copy & Commit, or Open in Browser

### Via Context Menu

1. Select markdown text in editor
2. Right-click → `Encode Selection as Itty-Bitty URL`
3. Choose action

### Via Copilot Chat (MCP Tool)

1. Open Copilot Chat
2. Paste markdown
3. Type: `@ittyBlog Create a blog post from this markdown`
4. Tool automatically encodes and returns URL

## Configuration

### GitHub Integration

Set your GitHub token in VS Code settings:

```json
{
     "ittyBlog.githubToken": "<set-via-secrets-or-auth>",
  "ittyBlog.autoCommit": true,
  "ittyBlog.deployBranch": "main"
}
```

The extension uses `simple-git` to:
- Commit posts with metadata
- Push to GitHub
- Trigger Actions workflow

### Size Limits

- ⚠️ Max raw: 32 KB
- ⚠️ Max compressed (social): 4 KB
- ✅ Typical post: 500-1000 words

## How It Works

```
┌─────────────────┐
│  Paste markdown │
└────────┬────────┘
         │
    ┌────▼────────────────────────┐
    │ Extension encodes:          │
    │ - zlib.deflateSync()        │
    │ - base64url encode          │
    │ - build itty-bitty URL      │
    └────┬─────────────────────────┘
         │
    ┌────▼──────────────────┐
    │  Choose action:       │
    │ - Copy URL            │
    │ - Open in browser     │
    │ - Commit & deploy     │
    └────┬──────────────────┘
         │
   ┌─────▼──────────────────────┐
   │ (If commit):               │
   │ - Create git commit        │
   │ - Push to GitHub           │
   │ - Trigger Actions          │
   │ - Deploy to Pages          │
   └────────────────────────────┘
```

## Requirements

- VS Code 1.102.0+
- Node.js 18+ (for building)
- Git CLI (for commits)
- Optional: GitHub token (for deployments)

## Development

### Build

```bash
npm run compile          # TypeScript → JavaScript
npm run watch          # Watch mode
npm run build          # Package as .vsix
```

### Test

```bash
npm test               # Run tests
npx tsc --noEmit      # Type check
```

### Debug

1. Press `F5` to open Extension Development Host
2. Test commands in new VS Code window
3. Check "Debug Console" for logs

## Architecture

### Extension Code

- `src/extension.ts` - Main extension, commands
- `src/encoder.ts` - Compression logic
- `src/git-integration.ts` - Git/GitHub operations
- `src/mcp-server.ts` - MCP tool definitions

### Key Dependencies

- `simple-git` - Git operations
- Built-in `zlib` - Compression
- VS Code API - UI/chat integration

## Troubleshooting

### "Git operation failed"

- Ensure you're in a Git repository
- Run `git init` to initialize
- Configure Git: `git config user.email` / `git config user.name`

### "Content too large"

- Keep posts under 4KB compressed
- Try splitting into multiple posts
- Remove unnecessary whitespace/formatting

### Extension not appearing in Chat

- Ensure VS Code 1.102.0+ (MCP support)
- Reload window: `Developer: Reload Window`
- Check "Output" tab for errors

## Contributing

Contributions welcome! Please:

1. Test locally with `npm run compile`
2. Validate encoding before push
3. Update README for new features

## License

MIT

---

**Questions?** Open an issue or check [blog-repo README](../blog-repo/README.md).
