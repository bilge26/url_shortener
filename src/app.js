const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const testRoutes = require('./routes/testRoutes');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');


const app = express();

// Middleware'ler
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/test', testRoutes);
app.use('/', urlRoutes);
app.use('/api', analyticsRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.send('URL Shortener Service is running');
});

module.exports = app;
