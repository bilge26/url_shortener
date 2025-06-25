const express = require('express');
const router = express.Router();
const rateLimiter = require('../middleware/rateLimiter');
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');
const { shortenUrl, redirectUrl } = require('../controllers/urlController');

// Token gerektirir
router.post('/shorten', rateLimiter, validate, auth, shortenUrl);

// Public erişim
router.get('/:shortCode', redirectUrl);

module.exports = router;
