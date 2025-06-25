const express = require('express');
const router = express.Router();
const rateLimiter = require('../middleware/rateLimiter');

const { shortenUrl, redirectUrl, getAllUrls, getUrlStats } = require('../controllers/urlController');

// ✅ Rate limitli kısaltma endpoint'i (doğru kullanım)
router.post('/shorten', rateLimiter, shortenUrl);

// Analytics ve yönlendirme endpoint'leri
router.get('/:shortCode', redirectUrl);
router.get('/shorten/stats/:shortCode', getUrlStats);

module.exports = router;
