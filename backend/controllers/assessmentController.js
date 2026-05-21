const { calculatePHQ9Score } = require('../utils/constants');

exports.submitAssessment = async (req, res, next) => {
  try {
    const { answers, userId } = req.body;
    
    if (!answers || !Array.isArray(answers) || answers.length !== 9) {
      return res.status(400).json({ 
        error: 'Invalid assessment data. Need 9 answers.' 
      });
    }
    
    // Validate each answer is between 0-3
    for (let answer of answers) {
      if (answer < 0 || answer > 3) {
        return res.status(400).json({ 
          error: 'Answers must be between 0 and 3' 
        });
      }
    }
    
    const total = answers.reduce((sum, val) => sum + val, 0);
    const { severity, recommendation } = calculatePHQ9Score(total);
    
    // Save to database if userId provided
    if (userId) {
      // Save assessment result to database
      // await AssessmentResult.create({ userId, score: total, severity });
    }
    
    res.json({
      success: true,
      data: {
        score: total,
        severity,
        recommendation,
        maxScore: 27,
        minScore: 0,
        interpretation: {
          '0-4': 'Minimal depression',
          '5-9': 'Mild depression',
          '10-14': 'Moderate depression',
          '15-19': 'Moderately severe depression',
          '20-27': 'Severe depression'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAssessmentHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // Fetch from database
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};