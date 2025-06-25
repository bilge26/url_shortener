const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const encodeBase62 = require('../utils/shortCodeGenerator');
const isValidUrl = require('../utils/urlValidator');
const redis = require('../config/redis');


router.get('/urls', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM urls ORDER BY id DESC LIMIT 5');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Veritabanı hatası' });
  }
});
router.get('/shortcode/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const code = encodeBase62(id);
  res.send(`ID: ${id} → Short Code: ${code}`);
});

router.get('/validate', (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('URL gerekli');

  const valid = isValidUrl(url);
  res.send(`Geçerli mi? ${valid}`);
});

router.get('/redis-test', async (req, res) => {
  try {
    await redis.set('deneme_key', 'deneme_degeri', 'EX', 60);
    const value = await redis.get('deneme_key');
    res.send(`Redis test başarılı. Değer: ${value}`);
  } catch (err) {
    console.error('Redis test hatası:', err);
    res.status(500).send('Redis bağlantı hatası');
  }
});

module.exports = router;
