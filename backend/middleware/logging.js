const morgan = require('morgan');
const { logger, logRequest, logError } = require('../utils/logger');

// Morgan stream for HTTP request logging
const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

// Custom Morgan format
const morganFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Morgan middleware
const morganMiddleware = morgan(morganFormat, { stream: morganStream });

// Custom request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request start for debugging
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`→ ${req.method} ${req.url}`);
  }
  
  // Capture response
  const originalSend = res.json;
  res.json = function(data) {
    const responseTime = Date.now() - start;
    
    // Log request completion
    logRequest(req, res, responseTime);
    
    // Log slow requests (> 1 second)
    if (responseTime > 1000) {
      logger.warn({
        message: 'Slow request detected',
        method: req.method,
        url: req.url,
        responseTime: `${responseTime}ms`,
        ip: req.ip
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  logError(err, req);
  next(err);
};

// User action logger middleware
const userActionLogger = (action) => {
  return (req, res, next) => {
    const originalSend = res.json;
    res.json = function(data) {
      if (req.userId) {
        const { logger, logUserAction } = require('../utils/logger');
        logUserAction(req.userId, action, {
          url: req.url,
          method: req.method,
          statusCode: res.statusCode,
          responseData: data
        });
      }
      originalSend.call(this, data);
    };
    next();
  };
};

// Security event logger
const securityLogger = (req, eventType, details = {}) => {
  const { logSecurityEvent } = require('../utils/logger');
  logSecurityEvent(eventType, req.ip, {
    url: req.url,
    method: req.method,
    userAgent: req.get('user-agent'),
    ...details
  });
};

module.exports = {
  morganMiddleware,
  requestLogger,
  errorLogger,
  userActionLogger,
  securityLogger
};
