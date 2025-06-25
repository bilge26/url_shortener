const express = require('express');
const router = express.Router();

const { shortenUrl, redirectUrl, getAllUrls, getUrlStats } = require('../controllers/urlController');


// Kısaltma endpoint'i
router.post('/shorten', shortenUrl);

// Yönlendirme endpoint'i (en sonda!)
router.get('/:shortCode', redirectUrl);
router.get('/shorten/stats/:shortCode', getUrlStats);

module.exports = router;
