const MoodEntry = require('../models/MoodEntry');
const Assessment = require('../models/Assessment');

// Batch create mood entries
exports.batchCreateMoods = async (req, res) => {
  try {
    const { userId, entries } = req.body;
    
    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ error: 'Invalid entries array' });
    }
    
    if (entries.length > 100) {
      return res.status(400).json({ error: 'Max 100 entries per batch' });
    }
    
    const moodEntries = entries.map(entry => ({
      userId,
      moodValue: entry.moodValue,
      moodLabel: entry.moodLabel,
      note: entry.note,
      date: entry.date || new Date()
    }));
    
    const result = await MoodEntry.insertMany(moodEntries);
    
    res.status(201).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk delete old entries
exports.bulkDeleteOldEntries = async (req, res) => {
  try {
    const { userId, olderThanDays = 90 } = req.body;
    const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    
    const result = await MoodEntry.deleteMany({
      userId,
      date: { $lt: cutoff }
    });
    
    res.json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export user data
exports.exportUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [moods, assessments] = await Promise.all([
      MoodEntry.find({ userId }).lean(),
      Assessment.find({ userId }).lean()
    ]);
    
    res.json({
      success: true,
      data: {
        userId,
        exportDate: new Date(),
        moodHistory: moods,
        assessmentHistory: assessments,
        summary: {
          totalMoods: moods.length,
          totalAssessments: assessments.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
