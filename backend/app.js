// backend/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - Use simplified versions for now
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/therapists', require('./routes/therapistRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/assessment', require('./routes/assessmentRoutes'));
app.use('/api/crisis', require('./routes/crisisRoutes'));
app.use('/api/moods', require('./routes/moodRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;