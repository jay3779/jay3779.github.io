const { encode } = require('./encoder.js');
const fs = require('fs');

function printHelp() {
  console.log(`
AAH-CLI: Agent-Assisted Hypermedia Encoding CLI

Usage:
  aah-cli <command> [options]

Commands:
  encode      Encode text or a file.
  post        Generate a shareable blog post URL locally.
  help        Show this help message.

Encode Options:
  --text <string>   The text to encode.
  --file <path>     The path to a file to encode.
  --alg <algo>      The algorithm to use (default: gzip).

Post Options:
  --title <string>      Post title (required).
  --text <string>       Markdown content to encode.
  --file <path>         Path to markdown file to encode.
  --description <text>  Optional short description for metadata.
  --base-url <url>      Base URL for generated link.
                        Default: ITTY_BLOG_BASE_URL env var or https://how.bitty.site
  --json                Print machine-readable JSON output.
  `);
}

function getOptionValue(args, option) {
  const idx = args.indexOf(option);
  if (idx === -1 || !args[idx + 1]) {
    return '';
  }
  return args[idx + 1];
}

function loadTextOrFileContent(args) {
  const text = getOptionValue(args, '--text');
  if (text) {
    return text;
  }

  const filePath = getOptionValue(args, '--file');
  if (!filePath) {
    return '';
  }

  return fs.readFileSync(filePath, 'utf8');
}

function toBase64Url(base64) {
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function handleEncodeCommand(args) {
  const algorithm = getOptionValue(args, '--alg') || 'gzip';

  try {
    const textToEncode = loadTextOrFileContent(args);
    if (!textToEncode) {
      console.error('Error: provide content with --text or --file for encode command.');
      printHelp();
      return;
    }

    const encoded = encode(textToEncode, algorithm);
    console.log(encoded);
  } catch (error) {
    console.error(`Error: failed to encode content: ${error.message}`);
    printHelp();
  }
}

function getPostBaseUrl(args) {
  const fromArgs = getOptionValue(args, '--base-url');
  if (fromArgs) {
    return fromArgs;
  }

  if (process.env.ITTY_BLOG_BASE_URL) {
    return process.env.ITTY_BLOG_BASE_URL;
  }

  return 'https://how.bitty.site';
}

function handlePostCommand(args) {
  const title = getOptionValue(args, '--title');
  if (!title) {
    console.error('Error: --title is required for post command.');
    printHelp();
    return;
  }

  try {
    const content = loadTextOrFileContent(args);
    if (!content) {
      console.error('Error: provide post content with --text or --file.');
      printHelp();
      return;
    }

    const description = getOptionValue(args, '--description');
    const baseUrl = getPostBaseUrl(args).replace(/\/$/, '');
    const compressedBase64 = encode(content, 'gzip');
    const payload = toBase64Url(compressedBase64);
    const titleEncoded = encodeURIComponent(title.slice(0, 80));
    const url = `${baseUrl}/#${titleEncoded}/${payload}`;

    const result = {
      title,
      description,
      url,
      rawSize: Buffer.byteLength(content, 'utf8'),
      compressedSize: Buffer.from(compressedBase64, 'base64').length,
      generatedAt: new Date().toISOString()
    };

    if (args.includes('--json')) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    console.log('Generated blog post URL:');
    console.log(result.url);
    console.log(`Raw size: ${result.rawSize} bytes`);
    console.log(`Compressed size: ${result.compressedSize} bytes`);
    if (result.description) {
      console.log(`Description: ${result.description}`);
    }
  } catch (error) {
    console.error(`Error: failed to generate post URL: ${error.message}`);
    printHelp();
  }
}

function main(args) { // Modified main to accept args
  const command = args[0];

  switch (command) {
    case 'encode':
      handleEncodeCommand(args.slice(1));
      break;

    case 'post':
      handlePostCommand(args.slice(1));
      break;

    case 'help':
    case '--help':
    case undefined:
    default:
      printHelp();
      break;
  }
}

module.exports = {
  main,
  printHelp,
  handleEncodeCommand,
  handlePostCommand,
  toBase64Url,
  getOptionValue
};
