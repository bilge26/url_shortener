// middleware/validation.js
module.exports = (req, res, next) => {
  const { original_url, custom_alias, expires_at } = req.body;

  if (!original_url || typeof original_url !== 'string') {
    return res.status(400).json({ error: 'original_url zorunludur ve string olmalıdır' });
  }

  if (custom_alias && typeof custom_alias !== 'string') {
    return res.status(400).json({ error: 'custom_alias bir string olmalıdır' });
  }

  if (expires_at && isNaN(Date.parse(expires_at))) {
    
    return res.status(400).json({ error: 'expires_at geçerli bir ISO tarih formatında olmalıdır' });
  }

  next();
};
