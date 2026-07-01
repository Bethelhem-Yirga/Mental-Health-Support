const User = require('../models/User');
const MoodEntry = require('../models/MoodEntry');
const Assessment = require('../models/Assessment');
const { logger, logUserAction } = require('../utils/logger');

exports.createUser = async (req, res) => {
  try {
    const user = new User();
    await user.save();
    
    // Log user creation
    logger.info('User created', { userId: user._id, anonymousId: user.anonymousId });
    
    res.status(201).json({
      success: true,
      data: {
        userId: user._id,
        anonymousId: user.anonymousId
      }
    });
  } catch (error) {
    logger.error('Failed to create user', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId || req.params.userId;
    
    const user = await User.findById(userId)
      .populate('recentMoods');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const moodStats = await MoodEntry.aggregate([
      { $match: { userId: user._id } },
      { $group: {
        _id: null,
        averageMood: { $avg: '$moodValue' },
        totalEntries: { $sum: 1 }
      }}
    ]);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          anonymousId: user.anonymousId,
          email: user.email,
          name: user.name,
          preferences: user.preferences,
          stats: user.stats
        },
        moodStats: moodStats[0] || { averageMood: 0, totalEntries: 0 },
        recentMoods: user.recentMoods
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.userId || req.params.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.preferences = { ...user.preferences, ...req.body };
    await user.save();
    
    res.json({
      success: true,
      data: user.preferences
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserData = async (req, res) => {
  try {
    const userId = req.userId || req.params.userId;
    
    await MoodEntry.deleteMany({ userId });
    await Assessment.deleteMany({ userId });
    await User.findByIdAndDelete(userId);
    
    res.json({
      success: true,
      message: 'All user data has been permanently deleted'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};