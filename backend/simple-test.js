const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

console.log('Testing connection...');
console.log('URI:', uri?.replace(/password=[^&]+/, 'password=HIDDEN'));

if (!uri) {
  console.error('No MONGODB_URI in .env');
  process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db('mentalhealth');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    await client.close();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.log('\n💡 Check:');
    console.log('   1. Username and password are correct');
    console.log('   2. Network Access has 0.0.0.0/0 in Atlas');
    console.log('   3. Your cluster is active (green status)');
  }
}

run();
