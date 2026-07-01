const redis = require('redis');

let redisClient = null;

const initRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 10000,
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.log('❌ Redis connection failed after 10 retries');
            return new Error('Redis connection failed');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });
    
    redisClient.on('error', (err) => {
      console.log('Redis Client Error:', err);
    });
    
    redisClient.on('connect', () => {
      console.log('✅ Redis connected');
    });
    
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.log('⚠️ Redis not available, running without cache');
    return null;
  }
};

// Cache middleware
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    if (!redisClient) return next();
    
    // Don't cache POST/PUT/DELETE requests
    if (req.method !== 'GET') return next();
    
    // Create cache key from URL
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        const data = JSON.parse(cachedData);
        res.setHeader('X-Cache', 'HIT');
        return res.json(data);
      }
      
      // Store original send function
      const originalSend = res.json;
      res.json = function(data) {
        res.setHeader('X-Cache', 'MISS');
        redisClient.setEx(key, duration, JSON.stringify(data));
        originalSend.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};

// Cache invalidation
const invalidateCache = async (pattern) => {
  if (!redisClient) return;
  
  const keys = await redisClient.keys(`cache:${pattern}`);
  if (keys.length) {
    await redisClient.del(keys);
    console.log(`🗑️ Invalidated ${keys.length} cache keys`);
  }
};

module.exports = { initRedis, cacheMiddleware, invalidateCache, getRedis: () => redisClient };
