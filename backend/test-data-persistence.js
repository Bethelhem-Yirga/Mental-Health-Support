const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const MoodEntry = require('./models/MoodEntry');
const Assessment = require('./models/Assessment');
const Message = require('./models/Message');

let testUserId = null;

async function testDataPersistence() {
  console.log('\n========================================');
  console.log('💾 DATA PERSISTENCE TEST');
  console.log('========================================\n');
  
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');
  
  // ========== 1. CREATE USER ==========
  console.log('📝 1. CREATING USER');
  console.log('----------------------------------------');
  try {
    const user = new User({
      anonymousId: 'test_user_' + Date.now(),
      name: 'Test User',
      preferences: {
        dailyReminder: true,
        reminderTime: '20:00'
      }
    });
    await user.save();
    testUserId = user._id;
    console.log(`✅ User created successfully!`);
    console.log(`   User ID: ${testUserId}`);
    console.log(`   Anonymous ID: ${user.anonymousId}`);
    console.log(`   Created at: ${user.createdAt}`);
  } catch (error) {
    console.error(`❌ User creation failed: ${error.message}`);
  }
  
  // ========== 2. READ USER ==========
  console.log('\n📖 2. READING USER');
  console.log('----------------------------------------');
  try {
    const user = await User.findById(testUserId);
    if (user) {
      console.log(`✅ User found!`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Preferences: ${JSON.stringify(user.preferences)}`);
    } else {
      console.log(`❌ User not found`);
    }
  } catch (error) {
    console.error(`❌ Read failed: ${error.message}`);
  }
  
  // ========== 3. CREATE MOOD ENTRY ==========
  console.log('\n😊 3. CREATING MOOD ENTRY');
  console.log('----------------------------------------');
  try {
    const mood = new MoodEntry({
      userId: testUserId,
      moodValue: 2,
      moodLabel: '😐 Okay',
      note: 'Test mood entry for persistence',
      date: new Date()
    });
    await mood.save();
    console.log(`✅ Mood entry created!`);
    console.log(`   Mood ID: ${mood._id}`);
    console.log(`   Mood: ${mood.moodLabel}`);
  } catch (error) {
    console.error(`❌ Mood creation failed: ${error.message}`);
  }
  
  // ========== 4. READ MOOD ENTRIES ==========
  console.log('\n📊 4. READING MOOD ENTRIES');
  console.log('----------------------------------------');
  try {
    const moods = await MoodEntry.find({ userId: testUserId });
    console.log(`✅ Found ${moods.length} mood entries`);
    moods.forEach((mood, i) => {
      console.log(`   ${i+1}. ${mood.moodLabel} - ${mood.note}`);
    });
  } catch (error) {
    console.error(`❌ Read failed: ${error.message}`);
  }
  
  // ========== 5. CREATE ASSESSMENT ==========
  console.log('\n📋 5. CREATING ASSESSMENT');
  console.log('----------------------------------------');
  try {
    const assessment = new Assessment({
      userId: testUserId,
      answers: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      score: 9,
      severity: 'Mild',
      recommendation: 'Monitor symptoms and practice self-care'
    });
    await assessment.save();
    console.log(`✅ Assessment created!`);
    console.log(`   Assessment ID: ${assessment._id}`);
    console.log(`   Score: ${assessment.score} - ${assessment.severity}`);
  } catch (error) {
    console.error(`❌ Assessment creation failed: ${error.message}`);
  }
  
  // ========== 6. READ ASSESSMENTS ==========
  console.log('\n📈 6. READING ASSESSMENTS');
  console.log('----------------------------------------');
  try {
    const assessments = await Assessment.find({ userId: testUserId });
    console.log(`✅ Found ${assessments.length} assessments`);
    assessments.forEach((assessment, i) => {
      console.log(`   ${i+1}. Score: ${assessment.score} (${assessment.severity})`);
    });
  } catch (error) {
    console.error(`❌ Read failed: ${error.message}`);
  }
  
  // ========== 7. UPDATE USER ==========
  console.log('\n✏️ 7. UPDATING USER');
  console.log('----------------------------------------');
  try {
    const user = await User.findById(testUserId);
    user.name = 'Updated Test User';
    user.preferences.darkMode = true;
    await user.save();
    console.log(`✅ User updated!`);
    console.log(`   New name: ${user.name}`);
    console.log(`   Dark mode: ${user.preferences.darkMode}`);
  } catch (error) {
    console.error(`❌ Update failed: ${error.message}`);
  }
  
  // ========== 8. VERIFY UPDATE PERSISTED ==========
  console.log('\n🔍 8. VERIFYING UPDATE PERSISTED');
  console.log('----------------------------------------');
  try {
    const user = await User.findById(testUserId);
    if (user.name === 'Updated Test User') {
      console.log(`✅ Update persisted correctly!`);
    } else {
      console.log(`❌ Update not persisted`);
    }
  } catch (error) {
    console.error(`❌ Verification failed: ${error.message}`);
  }
  
  // ========== 9. COLLECTION STATISTICS ==========
  console.log('\n📊 9. COLLECTION STATISTICS');
  console.log('----------------------------------------');
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      const stats = await db.collection(col.name).stats();
      console.log(`\n📁 ${col.name}:`);
      console.log(`   Documents: ${count}`);
      console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`   Indexes: ${stats.nindexes}`);
    }
  } catch (error) {
    console.error(`❌ Stats failed: ${error.message}`);
  }
  
  // ========== 10. DELETE TEST DATA ==========
  console.log('\n🗑️ 10. CLEANING UP TEST DATA');
  console.log('----------------------------------------');
  try {
    await MoodEntry.deleteMany({ userId: testUserId });
    await Assessment.deleteMany({ userId: testUserId });
    await User.findByIdAndDelete(testUserId);
    console.log(`✅ Test data deleted successfully!`);
  } catch (error) {
    console.error(`❌ Cleanup failed: ${error.message}`);
  }
  
  // ========== 11. FINAL VERIFICATION ==========
  console.log('\n✅ 11. FINAL VERIFICATION');
  console.log('----------------------------------------');
  try {
    const user = await User.findById(testUserId);
    if (!user) {
      console.log(`✅ Test user successfully removed from database`);
    } else {
      console.log(`❌ Test user still exists`);
    }
  } catch (error) {
    console.error(`❌ Verification failed: ${error.message}`);
  }
  
  await mongoose.disconnect();
  console.log('\n========================================');
  console.log('✅ DATA PERSISTENCE TEST COMPLETE');
  console.log('========================================\n');
}

testDataPersistence().catch(console.error);
