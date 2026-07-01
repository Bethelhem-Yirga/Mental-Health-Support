const mongoose = require('mongoose');
require('dotenv').config();

async function createIndexes() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  console.log('📊 Creating database indexes for performance...\n');
  
  // User indexes
  await mongoose.connection.db.collection('users').createIndexes([
    { key: { anonymousId: 1 }, name: 'idx_anonymous_id' },
    { key: { email: 1 }, name: 'idx_email', unique: true, sparse: true },
    { key: { createdAt: -1 }, name: 'idx_created_at' },
    { key: { 'stats.lastActive': -1 }, name: 'idx_last_active' },
    { key: { 'stats.currentStreak': -1 }, name: 'idx_streak' }
  ]);
  console.log('✅ User indexes created');
  
  // MoodEntry indexes
  await mongoose.connection.db.collection('moodentries').createIndexes([
    { key: { userId: 1, date: -1 }, name: 'idx_user_date' },
    { key: { userId: 1, moodValue: 1 }, name: 'idx_user_mood' },
    { key: { date: -1 }, name: 'idx_date' },
    { key: { moodValue: 1 }, name: 'idx_mood_value' }
  ]);
  console.log('✅ MoodEntry indexes created');
  
  // Assessment indexes
  await mongoose.connection.db.collection('assessments').createIndexes([
    { key: { userId: 1, takenAt: -1 }, name: 'idx_user_taken' },
    { key: { score: 1 }, name: 'idx_score' },
    { key: { severity: 1 }, name: 'idx_severity' }
  ]);
  console.log('✅ Assessment indexes created');
  
  // Message indexes
  await mongoose.connection.db.collection('messages').createIndexes([
    { key: { room: 1, timestamp: -1 }, name: 'idx_room_timestamp' },
    { key: { timestamp: 1 }, name: 'idx_timestamp_ttl', expireAfterSeconds: 2592000 },
    { key: { anonymousId: 1 }, name: 'idx_anonymous_id' }
  ]);
  console.log('✅ Message indexes created');
  
  // Get index stats
  console.log('\n📈 Index Statistics:');
  const stats = await mongoose.connection.db.collection('users').indexStats();
  console.log(`   Users: ${stats.length} indexes`);
  
  await mongoose.disconnect();
  console.log('\n✅ All indexes created successfully!');
}

createIndexes().catch(console.error);
