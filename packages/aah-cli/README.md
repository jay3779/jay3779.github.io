# AAH-CLI

AAH-CLI is a local command-line utility for generating compressed, shareable blog post URLs.

This README intentionally focuses on local CLI usage only.

### Usage

The CLI can be used to compress and encode text using various algorithms, which can then be used to create `itty.bitty` links.

### Commands

- `encode` - Encode text or file content.
- `post` - Generate a blog post URL from markdown text or file input.
- `help` - Show usage.

#### Encode Text

To encode a string using the default `gzip` compression:

```bash
# First, install dependencies
npm install

# Run the CLI
node aah-cli.js encode --text "hello world"
```

This will output a base64-encoded string, which is the compressed version of your input text.

#### Encode File

```bash
node aah-cli.js encode --file ./post.md
```

#### Generate Blog Post URL (Local Only)

To programmatically generate a shareable blog post URL from the command line:

```bash
node aah-cli.js post --title "My Post" --text "# My Post\n\nHello from CLI"
```

From a markdown file:

```bash
node aah-cli.js post --title "My Post" --file ./post.md
```

Machine-readable JSON output:

```bash
node aah-cli.js post --title "My Post" --file ./post.md --json
```

Optional custom base URL:

```bash
node aah-cli.js post --title "My Post" --file ./post.md --base-url "https://how.bitty.site"
```

You can also set `ITTY_BLOG_BASE_URL` in your environment. This feature is local-only and does not require Cloudflare Pages, Firebase, or Netlify.
