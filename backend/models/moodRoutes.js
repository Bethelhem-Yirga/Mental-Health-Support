const express = require('express');
const router = express.Router();
const {
  createMoodEntry,
  getMoodEntries,
  deleteMoodEntry
} = require('../controllers/moodController');

router.post('/entry', createMoodEntry);
router.get('/entries', getMoodEntries);
router.delete('/entry/:id', deleteMoodEntry);

module.exports = router;
EOF
