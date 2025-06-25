const pool = require('../config/database');

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        short_code VARCHAR(20) UNIQUE, -- NOT NULL kaldırıldı
        original_url TEXT NOT NULL,
        custom_alias VARCHAR(50),
        user_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        click_count INTEGER DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        url_id INTEGER REFERENCES urls(id) ON DELETE CASCADE,
        clicked_at TIMESTAMP DEFAULT NOW(),
        ip_address VARCHAR(45),
        user_agent TEXT,
        referer TEXT,
        country VARCHAR(100),
        city VARCHAR(100)
      );
    `);

    await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`);


    console.log('✅ Tables created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating tables:', err);
    process.exit(1);
  }
};

createTables();
