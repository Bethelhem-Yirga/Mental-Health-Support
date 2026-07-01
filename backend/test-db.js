const mongoose = require('mongoose');
require('dotenv').config();

const test = async () => {
  console.log('Testing connection...');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ CONNECTED SUCCESSFULLY!');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    
    // Test creating a collection
    const testCol = mongoose.connection.db.collection('test');
    await testCol.insertOne({ message: 'Hello Atlas!', time: new Date() });
    console.log('✅ Write test passed');
    
    await mongoose.disconnect();
    console.log('✅ All tests passed!');
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
};

test();