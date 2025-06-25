const request = require('supertest');
const app = require('../src/app');

describe('API Integration Tests', () => {
  let shortCode;

  it('POST /shorten should return shortened URL', async () => {
    const res = await request(app).post('/shorten').send({
      original_url: 'https://example.com',
      expires_at: '2025-12-31T23:59:59Z',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('short_code');
    shortCode = res.body.short_code;
  });

  it('GET /:shortCode should redirect', async () => {
    const res = await request(app).get(`/${shortCode}`);
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('https://example.com');
  });
});
