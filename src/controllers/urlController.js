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
      const existing = await pool.query('SELECT * FROM urls WHERE short_code = $1', [custom_alias]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Custom alias zaten kullanılıyor' });
      }
      short_code = custom_alias;
    } else {
      const result = await pool.query(
        'INSERT INTO urls (original_url, created_at, expires_at) VALUES ($1, NOW(), $2) RETURNING id',
        [original_url, expires_at]
      );
      const id = result.rows[0].id;
      short_code = encodeBase62(id);
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

const redirectUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM urls WHERE short_code = $1 AND is_active = true',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link bulunamadı' });
    }

    const urlData = result.rows[0];

    if (urlData.expires_at && new Date() > new Date(urlData.expires_at)) {
      return res.status(410).json({ error: 'Link süresi dolmuş' });
    }

    // 🔢 Click count artır
    await pool.query(
      'UPDATE urls SET click_count = click_count + 1 WHERE id = $1',
      [urlData.id]
    );

    // 📊 Analytics kaydı
    await pool.query(
      `INSERT INTO analytics (url_id, ip_address, user_agent, referer)
       VALUES ($1, $2, $3, $4)`,
      [
        urlData.id,
        req.ip,
        req.headers['user-agent'],
        req.headers.referer || null
      ]
    );

    // 🔁 Yönlendir
    return res.redirect(urlData.original_url);
  } catch (err) {
    console.error('redirectUrl error:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
};

const getUrlStats = async (req, res) => {
  const { shortCode } = req.params;

  try {
    // 1. shortCode'a karşılık gelen URL'yi al
    const urlResult = await pool.query(
      'SELECT * FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (urlResult.rows.length === 0) {
      return res.status(404).json({ error: 'URL bulunamadı' });
    }

    const urlData = urlResult.rows[0];

    // 2. analytics verilerini çek
    const analyticsResult = await pool.query(
      `SELECT id, clicked_at, ip_address, user_agent, referer
       FROM analytics
       WHERE url_id = $1
       ORDER BY clicked_at DESC`,
      [urlData.id]
    );

    return res.status(200).json({
      original_url: urlData.original_url,
      short_code: urlData.short_code,
      created_at: urlData.created_at,
      total_clicks: urlData.click_count,
      analytics: analyticsResult.rows
    });
  } catch (err) {
    console.error('getUrlStats error:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
};


module.exports = { shortenUrl, redirectUrl, getUrlStats };
