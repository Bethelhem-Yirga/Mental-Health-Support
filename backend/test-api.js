const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let testUser = null;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function test(name, fn) {
  log(`\n📋 Testing: ${name}`, 'blue');
  try {
    await fn();
    log(`  ✓ ${name} passed`, 'green');
  } catch (error) {
    log(`  ✗ ${name} failed: ${error.message}`, 'red');
  }
}

async function testHealth() {
  const response = await axios.get(`${API_URL}/health`);
  if (response.status !== 200) throw new Error('Health check failed');
  log(`    Status: ${response.data.status}`, 'green');
}

async function testUserCreation() {
  const response = await axios.post(`${API_URL}/users/create`);
  if (!response.data.success) throw new Error('User creation failed');
  testUser = response.data.data.userId;
  log(`    Created user: ${testUser}`, 'green');
}

async function testMoodEntry() {
  if (!testUser) throw new Error('No test user available');
  
  const response = await axios.post(`${API_URL}/moods/entry`, {
    userId: testUser,
    moodValue: 3,
    moodLabel: '😐 Okay',
    note: 'Test mood entry'
  });
  if (response.status !== 201) throw new Error('Mood entry failed');
  log(`    Mood saved: ${response.data.data.moodLabel}`, 'green');
}

async function testGetMoods() {
  if (!testUser) throw new Error('No test user available');
  
  const response = await axios.get(`${API_URL}/moods/entries`, {
    params: { userId: testUser, limit: 10 }
  });
  if (!response.data.success) throw new Error('Failed to get moods');
  log(`    Found ${response.data.count} mood entries`, 'green');
}

async function testAssessment() {
  if (!testUser) throw new Error('No test user available');
  
  const answers = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  const response = await axios.post(`${API_URL}/assessment/submit`, {
    userId: testUser,
    answers
  });
  if (!response.data.success) throw new Error('Assessment submission failed');
  log(`    Score: ${response.data.data.score} - ${response.data.data.severity}`, 'green');
}

async function testTherapists() {
  const response = await axios.get(`${API_URL}/therapists`);
  if (!response.data.success) throw new Error('Failed to get therapists');
  log(`    Found ${response.data.data.length} therapists`, 'green');
}

async function testRateLimit() {
  let rateLimited = false;
  for (let i = 0; i < 110; i++) {
    try {
      await axios.get(`${API_URL}/health`);
    } catch (error) {
      if (error.response?.status === 429) {
        rateLimited = true;
        break;
      }
    }
  }
  if (!rateLimited) throw new Error('Rate limit not triggered');
  log(`    Rate limit working (blocked after 100 requests)`, 'green');
}

async function runAllTests() {
  log('\n========================================', 'blue');
  log('🧪 API ENDPOINT TESTING SUITE', 'blue');
  log('========================================\n', 'blue');
  
  await test('Health Check', testHealth);
  await test('User Creation', testUserCreation);
  await test('Mood Entry', testMoodEntry);
  await test('Get Moods', testGetMoods);
  await test('Assessment Submission', testAssessment);
  await test('Get Therapists', testTherapists);
  await test('Rate Limiting', testRateLimit);
  
  log('\n========================================', 'blue');
  log('✅ All tests completed!', 'green');
  log('========================================\n', 'blue');
}

// Install axios if not present
async function checkAxios() {
  try {
    require.resolve('axios');
  } catch (e) {
    console.log('Installing axios...');
    const { execSync } = require('child_process');
    execSync('npm install axios --save-dev', { stdio: 'inherit' });
  }
}

checkAxios().then(runAllTests).catch(console.error);
