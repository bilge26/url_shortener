const express = require('express');
const router = express.Router();
const { shortenUrl } = require('../controllers/urlController');

// POST /shorten → URL kısaltma
router.post('/shorten', shortenUrl);

module.exports = router;
