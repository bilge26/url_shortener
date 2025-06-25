const { findByShortCode } = require('../models/urlModel');
const { getAnalyticsByUrlId } = require('../models/analyticsModel');

const getUrlStats = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const urlData = await findByShortCode(shortCode);

    if (!urlData) {
      return res.status(404).json({ error: 'URL bulunamadı' });
    }

    const analytics = await getAnalyticsByUrlId(urlData.id);

    return res.status(200).json({
      original_url: urlData.original_url,
      short_code: urlData.short_code,
      created_at: urlData.created_at,
      total_clicks: urlData.click_count,
      analytics,
    });
  } catch (err) {
    console.error('getUrlStats error:', err);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
};

module.exports = { getUrlStats };
