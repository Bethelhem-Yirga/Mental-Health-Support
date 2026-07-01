const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  anonymousId: {
    type: String,
    unique: true,
    default: () => 'user_' + Math.random().toString(36).substring(2, 15)
  },
  name: {
    type: String,
    default: 'Anonymous User'
  },
  preferences: {
    dailyReminder: { type: Boolean, default: false },
    reminderTime: { type: String, default: '20:00' },
    darkMode: { type: Boolean, default: false }
  },
  stats: {
    totalMoods: { type: Number, default: 0 },
    totalAssessments: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

// Update last active timestamp
userSchema.methods.updateActivity = async function() {
  this.stats.lastActive = new Date();
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
