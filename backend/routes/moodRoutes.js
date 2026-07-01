const express = require('express');
const router = express.Router();
const {
  createMoodEntry,
  getMoodEntries,
  deleteMoodEntry
} = require('../controllers/moodController');
const {
  validateMoodEntry,
  validateMoodQuery,
  validateDeleteMood
} = require('../middleware/validators');

// All routes with validation
router.post('/entry', validateMoodEntry, createMoodEntry);
router.get('/entries', validateMoodQuery, getMoodEntries);
router.delete('/entry/:id', validateDeleteMood, deleteMoodEntry);

module.exports = router;
