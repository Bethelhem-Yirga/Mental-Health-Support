// backend/models/MoodEntry.js
const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  moodValue: {
    type: Number,
    required: true,
    min: 0,
    max: 4
  },
  moodLabel: {
    type: String,
    required: true,
    enum: ['😊 Great', '🙂 Good', '😐 Okay', '😔 Low', '😢 Very Low']
  },
  note: {
    type: String,
    maxlength: 500,
    trim: true
  },
  tags: [{
    type: String,
    enum: ['work', 'relationships', 'health', 'finance', 'family', 'other']
  }],
  sleep: {
    type: Number,
    min: 0,
    max: 24
  },
  exercise: {
    type: Boolean,
    default: false
  },
  social: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
moodEntrySchema.index({ userId: 1, date: -1 });

// Static method to get mood stats
moodEntrySchema.statics.getStats = async function(userId, days = 30) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), date: { $gte: cutoff } } },
    { $group: {
      _id: null,
      averageMood: { $avg: '$moodValue' },
      totalEntries: { $sum: 1 },
      bestMood: { $max: '$moodValue' },
      worstMood: { $min: '$moodValue' },
      withNotes: { $sum: { $cond: [{ $ifNull: ['$note', false] }, 1, 0] } }
    }}
  ]);
  
  return stats[0] || { averageMood: 0, totalEntries: 0 };
};

module.exports = mongoose.model('MoodEntry', moodEntrySchema);