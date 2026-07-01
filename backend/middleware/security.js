const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const express = require('express'); 

// ==================== 1. HELMET - Security Headers ====================
// Protects against: XSS, clickjacking, MIME sniffing, etc.
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws://localhost:5000", "wss://*.mongodb.net"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// ==================== 2. CORS - Cross-Origin Resource Sharing ====================
// Protects against: Unauthorized cross-origin requests
const corsConfig = cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-RateLimit-Limit', 'X-RateLimit-Remaining']
});

// ==================== 3. RATE LIMITING - DDoS Protection ====================
// Protects against: DDoS attacks, brute force, API abuse

// General API limiter - 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});

// Strict limiter for sensitive endpoints - 5 requests per 15 minutes
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: 'Too many attempts. Please try again later.'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  keyGenerator: (req) => req.ip
});

// Authentication limiter - 3 requests per minute
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,
  message: {
    success: false,
    error: 'Too many login attempts. Please wait 1 minute.'
  }
});

// Assessment submission limiter - 2 per hour
const assessmentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2,
  message: {
    success: false,
    error: 'You have reached the maximum number of assessments per hour.'
  }
});

// ==================== 4. COMPRESSION - Performance ====================
// Reduces bandwidth usage by 60-90%
const compressionConfig = compression({
  level: 6, // Compression level (1-9, 6 is balanced)
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
});

// ==================== 5. MORGAN - Request Logging ====================
// Helps with debugging and monitoring

// Custom token for response time
morgan.token('response-time-ms', (req, res) => {
  const time = res.getHeader('X-Response-Time');
  return time ? `${time}ms` : '-';
});

// Development logging (colored, concise)
const devLogFormat = morgan('dev');

// Production logging (combined format with extra info)
const prodLogFormat = morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time-ms', {
  stream: {
    write: (message) => {
      // In production, send to log file or service
      console.log(message.trim());
    }
  }
});

// Choose format based on environment
const morganConfig = process.env.NODE_ENV === 'production' ? prodLogFormat : devLogFormat;

// ==================== 6. HPP - HTTP Parameter Pollution ====================
// Protects against parameter pollution attacks
const hppConfig = hpp({
  checkBody: true,
  checkQuery: true,
  whitelist: ['limit', 'page', 'sort'] // Allowed duplicate parameters
});

// ==================== 7. COOKIE PARSER ====================
// Handles cookie parsing
const cookieParserConfig = cookieParser(process.env.COOKIE_SECRET || 'my-cookie-secret', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// ==================== 8. JSON & URLENCODED - Already in app.js ====================
// These are applied directly in app.js, not here

// ==================== 9. CUSTOM SECURITY HEADERS ====================
const customSecurityHeaders = (req, res, next) => {
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
};

// ==================== 10. REQUEST TIMESTAMP ====================
const requestTimestamp = (req, res, next) => {
  req.requestTime = new Date();
  res.setHeader('X-Request-Time', req.requestTime.toISOString());
  next();
};

// ==================== EXPORT ALL ====================
module.exports = {
  helmetConfig,
  corsConfig,
  generalLimiter,
  strictLimiter,
  authLimiter,
  assessmentLimiter,
  compressionConfig,
  morganConfig,
  hppConfig,
  cookieParserConfig,
  customSecurityHeaders,
  requestTimestamp
};
// Performance headers
const performanceHeaders = (req, res, next) => {
  // Cache control for static responses
  res.setHeader('Cache-Control', 'private, max-age=3600');
  
  // Enable Keep-Alive
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=5, max=1000');
  
  // Performance hints
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  
  next();
};

module.exports.performanceHeaders = performanceHeaders;
