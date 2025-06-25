const pool = require('../config/database');
const isValidUrl = require('../utils/urlValidator');
const encodeBase62 = require('../utils/shortCodeGenerator');

const shortenUrl = async (req, res) => {
  const { original_url, custom_alias, expires_at } = req.body;

  if (!isValidUrl(original_url)) {
    return res.status(400).json({ error: 'Geçersiz URL formatı' });
  }

  try {
    let short_code;

    if (custom_alias) {
      // Custom alias varsa, benzersiz mi kontrol et
      const existing = await pool.query('SELECT * FROM urls WHERE short_code = $1', [custom_alias]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Custom alias zaten kullanılıyor' });
      }
      short_code = custom_alias;
    } else {
      // Otomatik kod üret
      const result = await pool.query(
        'INSERT INTO urls (original_url, created_at, expires_at) VALUES ($1, NOW(), $2) RETURNING id',
        [original_url, expires_at]
      );
      const id = result.rows[0].id;
      short_code = encodeBase62(id);

      // short_code'u güncelle
      await pool.query('UPDATE urls SET short_code = $1 WHERE id = $2', [short_code, id]);
    }

    return res.status(201).json({
      short_url: `http://localhost:3000/${short_code}`,
      short_code,
      original_url,
      expires_at,
    });
  } catch (err) {
    console.error('shortenUrl error:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
};

module.exports = { shortenUrl };
