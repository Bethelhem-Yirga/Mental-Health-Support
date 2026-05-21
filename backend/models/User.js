const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  anonymousId: {
    type: String,
    required: true,
    unique: true
  },
  moodEntries: [{
    mood: String,
    moodValue: Number,
    note: String,
    date: Date
  }],
  assessmentResults: [{
    score: Number,
    severity: String,
    date: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);