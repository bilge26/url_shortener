const pool = require('../config/database');

const insertUrl = async ({ original_url, custom_alias, short_code, expires_at }) => {
  return await pool.query(
    `INSERT INTO urls (original_url, custom_alias, short_code, created_at, expires_at)
     VALUES ($1, $2, $3, NOW(), $4)`,
    [original_url, custom_alias, short_code, expires_at]
  );
};

const insertUrlWithoutCode = async ({ original_url, expires_at }) => {
  return await pool.query(
    'INSERT INTO urls (original_url, created_at, expires_at) VALUES ($1, NOW(), $2) RETURNING id',
    [original_url, expires_at]
  );
};

const updateShortCode = async (id, short_code) => {
  return await pool.query(
    'UPDATE urls SET short_code = $1 WHERE id = $2',
    [short_code, id]
  );
};

const findByShortCode = async (short_code) => {
  const result = await pool.query(
    'SELECT * FROM urls WHERE short_code = $1',
    [short_code]
  );
  return result.rows[0];
};

const findActiveByShortCode = async (short_code) => {
  const result = await pool.query(
    'SELECT * FROM urls WHERE short_code = $1 AND is_active = true',
    [short_code]
  );
  return result.rows[0];
};

const checkAliasExists = async (custom_alias) => {
  const result = await pool.query(
    'SELECT * FROM urls WHERE short_code = $1',
    [custom_alias]
  );
  return result.rows.length > 0;
};

const incrementClickCount = async (id) => {
  await pool.query(
    'UPDATE urls SET click_count = click_count + 1 WHERE id = $1',
    [id]
  );
};

module.exports = {
  insertUrl,
  insertUrlWithoutCode,
  updateShortCode,
  findByShortCode,
  findActiveByShortCode,
  checkAliasExists,
  incrementClickCount,
};
