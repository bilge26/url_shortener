const express = require('express');
const router = express.Router();

const { getUrlStats } = require('../controllers/analyticsController');

// 📊 İstatistik endpoint'i
router.get('/shorten/stats/:shortCode', getUrlStats);

module.exports = router;
