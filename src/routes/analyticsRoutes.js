const express = require('express');
const router = express.Router();
const { getUrlStats } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// 🔐 Sadece giriş yapmış kullanıcı erişebilir
router.get('/shorten/stats/:shortCode', auth, getUrlStats);

module.exports = router;
