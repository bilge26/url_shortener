const express = require('express');
const router = express.Router();
const rateLimiter = require('../middleware/rateLimiter');
const { shortenUrl, redirectUrl } = require('../controllers/urlController');

router.post('/shorten', rateLimiter, shortenUrl);
router.get('/:shortCode', redirectUrl);

module.exports = router;
