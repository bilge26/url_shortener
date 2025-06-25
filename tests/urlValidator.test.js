const isValidUrl = require('../src/utils/urlValidator');

describe('URL Validator', () => {
  it('should accept valid URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://example.com')).toBe(true);
  });

  it('should reject invalid URLs', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('ftp://file.com')).toBe(false);
  });
});

