const redis = require('../config/redis');

// Kısa kodla orijinal URL'i cache'e kaydet
const setCache = async (key, value, ttl = 3600) => {
  await redis.set(key, value, 'EX', ttl);
};

// Cache'den kısa kodla URL'i al
const getCache = async (key) => {
  return await redis.get(key);
};

module.exports = {
  setCache,
  getCache,
};
