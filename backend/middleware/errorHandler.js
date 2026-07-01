const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
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
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = { errorHandler, AppError };
// Validation error formatter
const formatValidationErrors = (errors) => {
  return errors.reduce((acc, err) => {
    acc[err.param] = err.msg;
    return acc;
  }, {});
};

// Log validation errors
const logValidationError = (req, errors) => {
  console.warn(`Validation Error on ${req.method} ${req.path}:`, {
    errors: errors.array(),
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip
  });
};

module.exports = {
  formatValidationErrors,
  logValidationError
};
