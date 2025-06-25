const redis = require('../config/redis');

const WINDOW_SIZE = 60; // saniye
const MAX_REQUESTS = 10;

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `rate_limit:${ip}`;

    const current = await redis.get(key);

    if (current && parseInt(current) >= MAX_REQUESTS) {
      return res.status(429).json({ error: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.' });
    }

    if (current) {
      await redis.incr(key);
    } else {
      await redis.set(key, 1, 'EX', WINDOW_SIZE); // ilk istek → sayaç başlat
    }

    next();
  } catch (err) {
    console.error('Rate limiter hatası:', err);
    next(); // hata varsa limiti bypass et
  }
};

module.exports = rateLimiter;
