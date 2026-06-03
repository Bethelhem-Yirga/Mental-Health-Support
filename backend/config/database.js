const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI not defined');
      process.exit(1);
    }
    
    console.log('📡 Connecting to MongoDB Atlas...');
    
    // Remove deprecated options - just connect directly
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB Atlas Connected!`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Host: ${conn.connection.host}`);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;