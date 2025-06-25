const pool = require('../config/database');

// IP, UA, lokasyon vs. ile kayıt oluştur
const insertAnalytics = async ({ url_id, ip_address, user_agent, referer, country, city }) => {
  await pool.query(
    `INSERT INTO analytics (url_id, ip_address, user_agent, referer, country, city)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [url_id, ip_address, user_agent, referer, country, city]
  );
};

// short_code'den analytics verilerini al
const getAnalyticsByUrlId = async (url_id) => {
  const result = await pool.query(
    `SELECT id, clicked_at, ip_address, user_agent, referer, country, city
     FROM analytics
     WHERE url_id = $1
     ORDER BY clicked_at DESC`,
    [url_id]
  );
  return result.rows;
};

module.exports = {
  insertAnalytics,
  getAnalyticsByUrlId,
};
