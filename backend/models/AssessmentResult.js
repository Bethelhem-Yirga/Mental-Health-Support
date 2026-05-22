const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['PHQ-9', 'GAD-7', 'PSS'],
    default: 'PHQ-9'
  },
  answers: {
    type: [Number],
    required: true,
    validate: {
      validator: function(answers) {
        return answers.length === 9 && answers.every(a => a >= 0 && a <= 3);
      },
      message: 'Invalid answers array'
    }
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 27
  },
  severity: {
    type: String,
    enum: ['Minimal', 'Mild', 'Moderate', 'Moderately Severe', 'Severe'],
    required: true
  },
  recommendation: {
    type: String,
    required: true
  },
  takenAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
assessmentSchema.index({ userId: 1, takenAt: -1 });

// Static method to get trend
assessmentSchema.statics.getTrend = async function(userId) {
  const assessments = await this.find({ userId })
    .sort({ takenAt: -1 })
    .limit(5);
  
  if (assessments.length === 0) return null;
  
  const scores = assessments.map(a => a.score);
  const trend = scores[0] - scores[scores.length - 1];
  
  return {
    current: scores[0],
    previous: scores[scores.length - 1],
    trend: trend > 0 ? 'improving' : trend < 0 ? 'worsening' : 'stable',
    improvement: Math.abs(trend)
  };
};

module.exports = mongoose.model('Assessment', assessmentSchema);