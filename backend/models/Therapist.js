const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  specialty: {
    type: String,
    required: true,
    enum: ['Anxiety & Depression', 'Trauma & PTSD', 'Teen Counseling', 'Addiction & Recovery', 'Relationship Counseling', 'BIPOC Mental Health']
  },
  subSpecialties: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  experience: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  onlineOnly: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  languages: [{
    type: String
  }],
  education: [{
    type: String
  }],
  about: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes for search
therapistSchema.index({ name: 'text', specialty: 'text', subSpecialties: 'text' });
therapistSchema.index({ rating: -1 });
therapistSchema.index({ price: 1 });
therapistSchema.index({ available: 1 });
therapistSchema.index({ onlineOnly: 1 });

module.exports = mongoose.model('Therapist', therapistSchema);
