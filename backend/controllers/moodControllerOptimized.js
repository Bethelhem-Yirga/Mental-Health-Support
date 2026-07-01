const mongoose = require('mongoose');
const MoodEntry = require('../models/MoodEntry');

// Optimized: Use aggregation pipeline for statistics
exports.getMoodStatsOptimized = async (req, res) => {
  try {
    const { userId, days = 30 } = req.query;
    
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    // Single aggregation pipeline - one database call instead of multiple
    const stats = await MoodEntry.aggregate([
      { 
        $match: { 
          userId: mongoose.Types.ObjectId(userId),
          date: { $gte: cutoff }
        } 
      },
      {
        $facet: {
          // Overall statistics
          overall: [
            { $group: {
              _id: null,
              avgMood: { $avg: '$moodValue' },
              totalEntries: { $sum: 1 },
              maxMood: { $max: '$moodValue' },
              minMood: { $min: '$moodValue' },
              withNotes: { $sum: { $cond: [{ $ifNull: ['$note', false] }, 1, 0] } }
            }}
          ],
          // Daily breakdown
          daily: [
            { $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
              avgMood: { $avg: '$moodValue' },
              count: { $sum: 1 }
            }},
            { $sort: { _id: -1 } },
            { $limit: 30 }
          ],
          // Mood distribution
          distribution: [
            { $group: {
              _id: '$moodValue',
              count: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);
    
    res.json({
      success: true,
      data: stats[0],
      queryTime: Date.now() - req.requestTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Optimized: Project only needed fields
exports.getMoodEntriesOptimized = async (req, res) => {
  try {
    const { userId, limit = 30, offset = 0 } = req.query;
    
    const moods = await MoodEntry.find({ userId })
      .select('moodValue moodLabel note date') // Only select needed fields
      .sort({ date: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .lean(); // Return plain objects (faster than Mongoose documents)
    
    // Get total count without loading data
    const total = await MoodEntry.countDocuments({ userId });
    
    res.json({
      success: true,
      data: moods,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
