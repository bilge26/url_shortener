const {
  insertUrl,
  insertUrlWithoutCode,
  updateShortCode,
  checkAliasExists,
  findActiveByShortCode,
  incrementClickCount,
} = require('../models/urlModel');

const { insertAnalytics } = require('../models/analyticsModel');
const isValidUrl = require('../utils/urlValidator');
const encodeBase62 = require('../utils/shortCodeGenerator');
const { getCache, setCache } = require('../utils/cache');
const geoip = require('geoip-lite');

const shortenUrl = async (req, res) => {
  const { original_url, custom_alias, expires_at } = req.body;

  if (!isValidUrl(original_url)) {
    return res.status(400).json({ error: 'Geçersiz URL formatı' });
  }

  try {
    let short_code;

    if (custom_alias) {
      const exists = await checkAliasExists(custom_alias);
      if (exists) {
        return res.status(409).json({ error: 'Custom alias zaten kullanılıyor' });
      }

      short_code = custom_alias;
      await insertUrl({ original_url, custom_alias, short_code, expires_at });
    } else {
      const result = await insertUrlWithoutCode({ original_url, expires_at });
      const id = result.rows[0].id;
      short_code = encodeBase62(id);
      await updateShortCode(id, short_code);
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
    const cachedUrl = await getCache(shortCode);
    if (cachedUrl) {
      console.log(`📦 Cache hit: ${shortCode}`);
      return res.redirect(cachedUrl);
    }

    const urlData = await findActiveByShortCode(shortCode);
    if (!urlData) {
      return res.status(404).json({ error: 'Link bulunamadı' });
    }

    if (urlData.expires_at && new Date() > new Date(urlData.expires_at)) {
      return res.status(410).json({ error: 'Link süresi dolmuş' });
    }

    await setCache(shortCode, urlData.original_url);
    await incrementClickCount(urlData.id);

    const rawIp = req.ip;
    const ip = rawIp === '::1' ? '8.8.8.8' : rawIp;
    const geo = geoip.lookup(ip);

    await insertAnalytics({
      url_id: urlData.id,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      referer: req.headers.referer || null,
      country: geo?.country || null,
      city: geo?.city || null,
    });

    return res.redirect(urlData.original_url);
  } catch (err) {
    console.error('redirectUrl error:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
};

module.exports = { shortenUrl, redirectUrl };
