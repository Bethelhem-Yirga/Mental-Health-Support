const autocannon = require('autocannon');

async function runBenchmark() {
  console.log('🚀 Running performance benchmarks...\n');
  
  const tests = [
    { name: 'Health Check', url: '/api/health' },
    { name: 'Get Therapists', url: '/api/therapists' },
    { name: 'Create User', url: '/api/users/create', method: 'POST' }
  ];
  
  for (const test of tests) {
    console.log(`Testing: ${test.name}`);
    
    const result = await autocannon({
      url: `http://localhost:5000${test.url}`,
      connections: 100,
      duration: 10,
      method: test.method || 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`  ✅ Requests/sec: ${result.requests.average}`);
    console.log(`  📊 Latency (ms): ${result.latency.average}`);
    console.log(`  ⚡ Throughput: ${(result.throughput.average / 1024).toFixed(2)} KB/s`);
    console.log('');
  }
}

runBenchmark().catch(console.error);
