const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    const options = {
      // Connection pool settings
      maxPoolSize: 20,           // Maximum number of connections
      minPoolSize: 5,            // Minimum number of connections
      maxIdleTimeMS: 30000,      // Close idle connections after 30 seconds
      connectTimeoutMS: 10000,    // 10 seconds to connect
      socketTimeoutMS: 45000,     // 45 seconds for operations
      family: 4,                  // Use IPv4
    
      // Retry logic
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
      
      // Write concern
      w: 'majority',
      wtimeoutMS: 5000,
      
      // Read preference (distribute reads across replicas)
      readPreference: 'secondaryPreferred'
    };
    
    console.log('📡 Connecting to MongoDB Atlas with optimized pool...');
    
    const conn = await mongoose.connect(mongoURI, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Connection Pool Size: ${options.maxPoolSize}`);
    
    // Monitor connection pool safely
    const monitorPool = () => {
      try {
        if (mongoose.connection && mongoose.connection.client) {
          const topology = mongoose.connection.client.topology;
          if (topology && topology.s && topology.s.pool) {
            const poolSize = topology.s.pool.size();
            console.log(`📊 Active DB connections: ${poolSize}`);
          }
        }
      } catch (error) {
        // Silently fail monitoring
      }
    };
    
    // Run monitor every minute
    const interval = setInterval(monitorPool, 60000);
    
    // Clear interval on app termination
    process.on('SIGINT', () => {
      clearInterval(interval);
      mongoose.disconnect();
      process.exit(0);
    });
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
