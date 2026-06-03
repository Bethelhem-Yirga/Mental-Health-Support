const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  console.log('🔍 Testing MongoDB Atlas connection...\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Connected successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    
    // Test creating a collection
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Write test successful');
    
    const result = await testCollection.findOne({ test: 'connection' });
    console.log('✅ Read test successful');
    
    // Clean up
    await testCollection.deleteMany({});
    console.log('✅ Cleanup successful');
    
    console.log('\n🎉 MongoDB Atlas is working perfectly!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Common issues:');
    console.log('   1. Check password special characters (escape them if needed)');
    console.log('   2. Add your IP to Atlas whitelist');
    console.log('   3. Check cluster status (may take a few minutes to deploy)');
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected');
  }
};

testConnection();