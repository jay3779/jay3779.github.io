const { main } = require('./aah-cli-wrapper'); // We will create a wrapper
const encoder = require('./encoder');
const fs = require('fs');

// Mock the encoder module
jest.mock('./encoder', () => ({
  encode: jest.fn(),
}));

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

describe('aah-cli', () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    // Spy on console.log and console.error
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // Reset mocks before each test
    encoder.encode.mockClear();
    fs.readFileSync.mockClear();
  });

  afterEach(() => {
    // Restore original implementations
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should call handleEncodeCommand with encode command', () => {
    const textToEncode = 'hello from test';
    main(['encode', '--text', textToEncode]);
    expect(encoder.encode).toHaveBeenCalledWith(textToEncode, 'gzip');
  });

  it('should encode from file for encode command', () => {
    fs.readFileSync.mockReturnValue('file input');
    main(['encode', '--file', 'input.txt']);
    expect(fs.readFileSync).toHaveBeenCalledWith('input.txt', 'utf8');
    expect(encoder.encode).toHaveBeenCalledWith('file input', 'gzip');
  });

  it('should pass selected algorithm to encoder', () => {
    main(['encode', '--text', 'abc', '--alg', 'gzip']);
    expect(encoder.encode).toHaveBeenCalledWith('abc', 'gzip');
  });

  it('should call printHelp for help command', () => {
    main(['help']);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
  });

  it('should call printHelp for --help command', () => {
    main(['--help']);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
  });

  it('should call printHelp for no command', () => {
    main([]);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
  });

  it('should call printHelp for unknown command', () => {
    main(['unknown-command']);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
  });

  it('should log an error if content is not provided for encode', () => {
    main(['encode']);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: provide content with --text or --file for encode command.');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
  });

  it('should generate a blog post URL from --text', () => {
    encoder.encode.mockReturnValue('YWJjZGVm==');
    main(['post', '--title', 'My Post', '--text', '# hello']);

    expect(encoder.encode).toHaveBeenCalledWith('# hello', 'gzip');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Generated blog post URL'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('https://how.bitty.site/#My%20Post/YWJjZGVm'));
  });

  it('should generate JSON output for post command', () => {
    encoder.encode.mockReturnValue('YWJjZA==');
    main(['post', '--title', 'Json Post', '--text', 'body', '--json']);

    const loggedJson = consoleLogSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedJson);
    expect(parsed.title).toBe('Json Post');
    expect(parsed.url).toContain('https://how.bitty.site/#Json%20Post/YWJjZA');
  });

  it('should read post content from --file', () => {
    fs.readFileSync.mockReturnValue('# from file');
    encoder.encode.mockReturnValue('YWJjZA==');
    main(['post', '--title', 'File Post', '--file', 'post.md']);

    expect(fs.readFileSync).toHaveBeenCalledWith('post.md', 'utf8');
    expect(encoder.encode).toHaveBeenCalledWith('# from file', 'gzip');
  });

  it('should error if --title is missing for post', () => {
    main(['post', '--text', 'body']);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: --title is required for post command.');
  });

  it('should error if no content is provided for post', () => {
    main(['post', '--title', 'No Content']);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: provide post content with --text or --file.');
  });

  it('should fall back to help for unknown command', () => {
    main(['publish']);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
  });
});
