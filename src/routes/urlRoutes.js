const express = require('express');
const router = express.Router();

const { shortenUrl, redirectUrl } = require('../controllers/urlController');

// Kısaltma endpoint'i
router.post('/shorten', shortenUrl);

// Yönlendirme endpoint'i (en sonda!)
router.get('/:shortCode', redirectUrl);

module.exports = router;
