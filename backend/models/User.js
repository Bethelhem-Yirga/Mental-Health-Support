const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  anonymousId: {
    type: String,
    required: true,
    unique: true,
    default: () => 'user_' + Math.random().toString(36).substr(2, 9)
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  preferences: {
    dailyReminder: { type: Boolean, default: false },
    reminderTime: { type: String, default: '20:00' },
    darkMode: { type: Boolean, default: false },
    anonymousMode: { type: Boolean, default: true }
  },
  stats: {
    totalMoods: { type: Number, default: 0 },
    totalAssessments: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for recent moods (last 7 days)
userSchema.virtual('recentMoods', {
  ref: 'MoodEntry',
  localField: '_id',
  foreignField: 'userId',
  options: { sort: { date: -1 }, limit: 7 }
});

// Virtual for recent assessments
userSchema.virtual('recentAssessments', {
  ref: 'Assessment',
  localField: '_id',
  foreignField: 'userId',
  options: { sort: { takenAt: -1 }, limit: 5 }
});

// Instance method to update streak
userSchema.methods.updateStreak = async function() {
  const lastMood = await mongoose.model('MoodEntry').findOne({
    userId: this._id
  }).sort({ date: -1 });
  
  const today = new Date().toDateString();
  const lastDate = lastMood ? new Date(lastMood.date).toDateString() : null;
  
  if (lastDate === today) {
    // Already logged today, no change
    return this.stats.currentStreak;
  }
  
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (lastDate === yesterday) {
    this.stats.currentStreak += 1;
  } else {
    this.stats.currentStreak = 1;
  }
  
  if (this.stats.currentStreak > this.stats.longestStreak) {
    this.stats.longestStreak = this.stats.currentStreak;
  }
  
  this.stats.lastActive = new Date();
  await this.save();
  
  return this.stats.currentStreak;
};

// Static method to find active users
userSchema.statics.findActiveUsers = function(days = 7) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.find({
    'stats.lastActive': { $gte: cutoff }
  });
};

module.exports = mongoose.model('User', userSchema);