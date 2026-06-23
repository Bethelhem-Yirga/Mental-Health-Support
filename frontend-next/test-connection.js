const axios = require('axios');

async function testConnection() {
  try {
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend is reachable!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Backend is NOT reachable');
    console.log('Error:', error.message);
  }
}

testConnection();
