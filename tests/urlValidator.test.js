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

    it('should reject malicious URLs', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
    expect(isValidUrl('data:text/html,<script>')).toBe(false);
    expect(isValidUrl('http://phishing.com')).toBe(false);
  });

});

