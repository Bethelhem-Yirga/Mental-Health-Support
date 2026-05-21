const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    enum: ['😊 Great', '🙂 Good', '😐 Okay', '😔 Low', '😢 Very Low'],
    required: true
  },
  moodValue: {
    type: Number,
    min: 0,
    max: 4,
    required: true
  },
  note: {
    type: String,
    maxlength: 500
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MoodEntry', moodEntrySchema);