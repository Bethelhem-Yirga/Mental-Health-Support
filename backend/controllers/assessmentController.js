const Assessment = require('../models/Assessment');
const User = require('../models/User');

exports.submitAssessment = async (req, res) => {
  try {
    const { userId, answers } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required'
      });
    }
    
    if (!answers || !Array.isArray(answers) || answers.length !== 9) {
      return res.status(400).json({
        success: false,
        error: 'Invalid assessment data. Need 9 answers.'
      });
    }
    
    const total = answers.reduce((sum, val) => sum + val, 0);
    let severity = "Minimal";
    let recommendation = "Continue your wellness practices";
    
    if (total >= 5 && total <= 9) {
      severity = "Mild";
      recommendation = "Consider self-help strategies and monitor symptoms";
    } else if (total >= 10 && total <= 14) {
      severity = "Moderate";
      recommendation = "Consider speaking with a therapist";
    } else if (total >= 15 && total <= 19) {
      severity = "Moderately Severe";
      recommendation = "Strongly recommend consulting a mental health professional";
    } else if (total >= 20) {
      severity = "Severe";
      recommendation = "Please seek professional help immediately";
    }
    
    const assessment = new Assessment({
      userId,
      answers,
      score: total,
      severity,
      recommendation
    });
    
    await assessment.save();
    
    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      user.stats.totalAssessments += 1;
      await user.save();
    }
    
    res.json({
      success: true,
      data: {
        score: total,
        severity,
        recommendation,
        assessmentId: assessment._id
      }
    });
  } catch (error) {
    console.error('Assessment error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAssessmentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const assessments = await Assessment.find({ userId })
      .sort({ takenAt: -1 });
    
    res.json({
      success: true,
      count: assessments.length,
      data: assessments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
