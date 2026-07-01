const mongoose = require('mongoose');
const MoodEntry = require('../models/MoodEntry');
const User = require('../models/User');
const { logger, logUserAction, logPerformance } = require('../utils/logger');


// Create mood entry (data is already validated)
exports.createMoodEntry = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { userId, moodValue, moodLabel, note } = req.body;
    
    const moodEntry = new MoodEntry({
      userId,
      moodValue,
      moodLabel,
      note,
      date: new Date()
    });
    
    await moodEntry.save();
    
    // Log user action
    logUserAction(userId, 'CREATE_MOOD', { moodValue, moodLabel });
    
    // Log performance
    const duration = Date.now() - startTime;
    logPerformance('createMoodEntry', duration, { userId });
    
    res.status(201).json({
      success: true,
      data: moodEntry
    });
  } catch (error) {
    logger.error('Create mood error', { error: error.message, body: req.body });
    res.status(500).json({ error: error.message });
  }
};
// Get mood entries (query validated)
exports.getMoodEntries = async (req, res) => {
  try {
    const { userId, limit = 30, startDate, endDate } = req.query;
    
    const query = { userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const moods = await MoodEntry.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      count: moods.length,
      data: moods
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Delete mood entry
exports.deleteMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const moodEntry = await MoodEntry.findOne({ _id: id, userId });
    
    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        error: 'Mood entry not found'
      });
    }
    
    await moodEntry.deleteOne();
    
    // Update user stats
    const user = await User.findById(userId);
    if (user && user.stats.totalMoods > 0) {
      user.stats.totalMoods -= 1;
      await user.save();
    }
    
    res.json({
      success: true,
      message: 'Mood entry deleted'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
