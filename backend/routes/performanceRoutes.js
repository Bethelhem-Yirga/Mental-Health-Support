const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MoodEntry = require('../models/MoodEntry');
const Assessment = require('../models/Assessment');

// GET /api/optimized/moods - Paginated with cursor
router.get('/moods', async (req, res) => {
  try {
    const { userId, limit = 20, cursor } = req.query;
    
    const query = { userId };
    if (cursor) {
      query._id = { $lt: cursor };
    }
    
    const moods = await MoodEntry.find(query)
      .select('moodValue moodLabel note date')
      .sort({ _id: -1 })
      .limit(parseInt(limit) + 1)
      .lean();
    
    const hasMore = moods.length > limit;
    const results = hasMore ? moods.slice(0, -1) : moods;
    const nextCursor = hasMore ? results[results.length - 1]._id : null;
    
    res.json({
      success: true,
      data: results,
      pagination: {
        limit: parseInt(limit),
        nextCursor,
        hasMore
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/optimized/stats/:userId - Aggregated statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;
    
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const stats = await MoodEntry.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), date: { $gte: cutoff } } },
      {
        $facet: {
          overview: [
            { $group: {
              _id: null,
              avgMood: { $avg: '$moodValue' },
              total: { $sum: 1 },
              bestMood: { $min: '$moodValue' },
              worstMood: { $max: '$moodValue' }
            }}
          ],
          weekly: [
            { $group: {
              _id: { $week: '$date' },
              avgMood: { $avg: '$moodValue' },
              weekStart: { $min: '$date' },
              count: { $sum: 1 }
            }},
            { $sort: { '_id': -1 } },
            { $limit: 8 }
          ]
        }
      }
    ]);
    
    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
