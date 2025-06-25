const encodeBase62 = require('../src/utils/shortCodeGenerator');

describe('Short Code Generator', () => {
  it('should generate a 6-character code for a given ID', () => {
    const code = encodeBase62(123456);
    expect(code).toHaveLength(6);
  });

  it('should return different codes for different IDs', () => {
    const code1 = encodeBase62(100);
    const code2 = encodeBase62(101);
    expect(code1).not.toBe(code2);
  });
});
