const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom format for console output (colorized)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = '';
    if (Object.keys(meta).length > 0 && meta.stack) {
      metaStr = `\n${meta.stack}`;
    } else if (Object.keys(meta).length > 0) {
      metaStr = `\n${JSON.stringify(meta, null, 2)}`;
    }
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

// Custom format for file output (JSON for easy parsing)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'ISO8601' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Daily rotate file transport for all logs
const dailyRotateTransport = new DailyRotateFile({
  filename: path.join(logDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: fileFormat,
  level: 'info'
});

// Separate error log file
const errorTransport = new DailyRotateFile({
  filename: path.join(logDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: fileFormat
});

// Console transport for development
const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    consoleTransport,
    dailyRotateTransport,
    errorTransport
  ],
  exitOnError: false
});

// Create stream for Morgan integration
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

// Helper methods for different log levels
const logRequest = (req, res, responseTime) => {
  logger.http({
    message: `${req.method} ${req.url}`,
    ip: req.ip,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('user-agent')
  });
};

const logError = (err, req = null) => {
  const errorLog = {
    message: err.message,
    stack: err.stack,
    name: err.name
  };
  
  if (req) {
    errorLog.url = req.url;
    errorLog.method = req.method;
    errorLog.ip = req.ip;
    errorLog.body = req.body;
    errorLog.query = req.query;
    errorLog.params = req.params;
  }
  
  logger.error(errorLog);
};

const logUserAction = (userId, action, details = {}) => {
  logger.info({
    type: 'USER_ACTION',
    userId,
    action,
    details,
    timestamp: new Date().toISOString()
  });
};

const logDatabaseQuery = (collection, operation, duration, filter = {}) => {
  logger.debug({
    type: 'DATABASE_QUERY',
    collection,
    operation,
    duration: `${duration}ms`,
    filter
  });
};

const logSecurityEvent = (eventType, ip, details = {}) => {
  logger.warn({
    type: 'SECURITY_EVENT',
    eventType,
    ip,
    details,
    timestamp: new Date().toISOString()
  });
};

const logPerformance = (operation, duration, metadata = {}) => {
  logger.info({
    type: 'PERFORMANCE',
    operation,
    duration: `${duration}ms`,
    metadata
  });
};

module.exports = {
  logger,
  logRequest,
  logError,
  logUserAction,
  logDatabaseQuery,
  logSecurityEvent,
  logPerformance
};
