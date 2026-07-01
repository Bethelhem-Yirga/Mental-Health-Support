const mongoose = require('mongoose');
require('dotenv').config();

async function checkConnection() {
  console.log('\n========================================');
  console.log('🗄️  MONGODB CONNECTION STATUS');
  console.log('========================================\n');
  
  // Check connection string
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('❌ MONGODB_URI not found in .env file');
    process.exit(1);
  }
  
  // Hide password in display
  const hiddenURI = mongoURI.replace(/\/\/(.*):.*@/, '//***:***@');
  console.log(`📡 Connection String: ${hiddenURI}`);
  
  try {
    // Test connection
    console.log('\n📡 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    
    console.log('✅ Connection successful!');
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Get connection pool info
    const serverStatus = await mongoose.connection.db.admin().serverStatus();
    console.log(`   MongoDB Version: ${serverStatus.version}`);
    console.log(`   Connections: ${serverStatus.connections.current}`);
    
    await mongoose.disconnect();
    console.log('\n✅ MongoDB connection test passed!');
    
  } catch (error) {
    console.error('\n❌ MongoDB connection failed!');
    console.error(`   Error: ${error.message}`);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify credentials in .env file');
    console.log('   3. Check IP whitelist in MongoDB Atlas');
    console.log('   4. Ensure cluster is not paused');
    process.exit(1);
  }
}

checkConnection();
