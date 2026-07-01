// Response time tracking - FIXED version
const responseTime = (req, res, next) => {
  const start = Date.now();
  
  // Use 'finish' event instead of trying to set headers after send
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log slow requests (> 1 second)
    if (duration > 1000) {
      console.warn(`⚠️ Slow request: ${req.method} ${req.url} - ${duration}ms`);
    }
  });
  
  next();
};

// Performance metrics collector
let metrics = {
  requests: 0,
  totalTime: 0,
  errors: 0,
  startTime: Date.now()
};

const metricsCollector = (req, res, next) => {
  const start = Date.now();
  metrics.requests++;
  
  // Use 'finish' event to track after response is sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.totalTime += duration;
    
    if (res.statusCode >= 400) {
      metrics.errors++;
    }
  });
  
  next();
};

const getMetrics = (req, res) => {
  const avgResponseTime = metrics.requests > 0 
    ? metrics.totalTime / metrics.requests 
    : 0;
  
  const uptime = (Date.now() - metrics.startTime) / 1000;
  
  res.json({
    success: true,
    data: {
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
      totalRequests: metrics.requests,
      errors: metrics.errors,
      avgResponseTime: `${avgResponseTime.toFixed(2)}ms`,
      errorRate: `${((metrics.errors / metrics.requests) * 100).toFixed(2)}%`,
      requestsPerSecond: metrics.requests > 0 ? (metrics.requests / uptime).toFixed(2) : '0.00'
    }
  });
};

// Reset metrics (for testing)
const resetMetrics = () => {
  metrics = {
    requests: 0,
    totalTime: 0,
    errors: 0,
    startTime: Date.now()
  };
};

module.exports = {
  responseTime,
  metricsCollector,
  getMetrics,
  resetMetrics
};
