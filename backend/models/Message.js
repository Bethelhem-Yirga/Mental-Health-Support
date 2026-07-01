// backend/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  anonymousId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  room: {
    type: String,
    default: 'general',
    index: true
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  flaggedReason: String,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// TTL index to auto-delete old messages (30 days)
messageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

// Static method to get recent messages
messageSchema.statics.getRecent = async function(room = 'general', limit = 50) {
  return this.find({ room })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
};

module.exports = mongoose.model('Message', messageSchema);