// generateToken.js
const jwt = require('jsonwebtoken');

const payload = { userId: 1, email: 'test@example.com' }; // İstediğin payload
const secret = JWT_SECRET; // .env'deki değerle aynı olmalı
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('JWT Token:', token);
