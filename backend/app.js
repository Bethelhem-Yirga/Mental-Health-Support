const express = require('express');
const dotenv = require('dotenv');
const {
  helmetConfig,
  corsConfig,
  generalLimiter,
  strictLimiter,
  authLimiter,
  assessmentLimiter,
  compressionConfig,
  hppConfig,
  cookieParserConfig,
  customSecurityHeaders,
  requestTimestamp
} = require('./middleware/security');
const { morganMiddleware, requestLogger, errorLogger } = require('./middleware/logging');
const { logger } = require('./utils/logger');
const { responseTime, metricsCollector, getMetrics } = require('./middleware/performance');

dotenv.config();

const app = express();

// Log server startup
logger.info('🚀 Initializing Mental Health API Server...');

// ==================== CRITICAL MIDDLEWARE ====================

// Performance - Response time tracking
app.use(responseTime);
app.use(metricsCollector);

// Security
app.use(helmetConfig);
app.use(corsConfig);
app.use(hppConfig);
app.use(compressionConfig);

// Logging
app.use(morganMiddleware);
app.use(requestLogger);

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParserConfig);

// Headers
app.use(customSecurityHeaders);
app.use(requestTimestamp);

// ==================== RATE LIMITING ====================

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/assessment/submit', assessmentLimiter);
app.use('/api/moods/entry', strictLimiter);

// ==================== ROUTES ====================

const userRoutes = require('./routes/userRoutes');
const moodRoutes = require('./routes/moodRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const therapistRoutes = require('./routes/therapistRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const crisisRoutes = require('./routes/crisisRoutes');
const authRoutes = require('./routes/authRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const { batchCreateMoods, bulkDeleteOldEntries, exportUserData } = require('./controllers/batchController');

app.use('/api/users', userRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/crisis', crisisRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/optimized', performanceRoutes);

// Performance metrics
app.get('/api/metrics', getMetrics);

// Batch operations
app.post('/api/batch/moods', batchCreateMoods);
app.delete('/api/batch/cleanup', bulkDeleteOldEntries);
app.get('/api/export/:userId', exportUserData);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: req.requestTime,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage(),
    version: '2.0.0'
  });
});

app.get('/api/ping', (req, res) => {
  res.json({ pong: true, time: new Date().toISOString() });
});

logger.info('✅ All API routes registered');

// ==================== 404 HANDLER ====================
app.use('*', (req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.url} from ${req.ip}`);
  res.status(404).json({
    success: false,
    error: {
      message: `Cannot ${req.method} ${req.originalUrl}`,
      status: 404
    }
  });
});

// ==================== GLOBAL ERROR HANDLER ====================
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      status: statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

logger.info('🚀 Server configuration complete!');
logger.info('📋 Middleware loaded successfully');

module.exports = app;