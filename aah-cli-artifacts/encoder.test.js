const { encode } = require('./encoder');
const zlib = require('zlib');

describe('encoder', () => {
  describe('encode', () => {
    it('should correctly encode a string with gzip', () => {
      const text = 'hello world';
      const expectedEncoded = zlib.gzipSync(Buffer.from(text, 'utf-8')).toString('base64');
      expect(encode(text, 'gzip')).toBe(expectedEncoded);
    });

    it('should return an empty string if the input text is empty', () => {
      expect(encode('', 'gzip')).toBe('');
    });

    it('should handle strings with special characters', () => {
      const text = '你好,世界 &*%^$#';
      const expectedEncoded = zlib.gzipSync(Buffer.from(text, 'utf-8')).toString('base64');
      expect(encode(text, 'gzip')).toBe(expectedEncoded);
    });

    describe('error handling', () => {
      let processExitSpy;

      beforeEach(() => {
        // Mock process.exit to prevent the test runner from exiting
        processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
        // Mock console.error to prevent logging during tests
        jest.spyOn(console, 'error').mockImplementation(() => {});
      });

      afterEach(() => {
        // Restore original implementations
        processExitSpy.mockRestore();
        console.error.mockRestore();
      });

      it('should exit the process when lzma is specified', () => {
        encode('test', 'lzma');
        expect(processExitSpy).toHaveBeenCalledWith(1);
      });

      it('should exit the process for an unknown algorithm', () => {
        encode('test', 'unknown');
        expect(processExitSpy).toHaveBeenCalledWith(1);
      });
    });
  });
});
