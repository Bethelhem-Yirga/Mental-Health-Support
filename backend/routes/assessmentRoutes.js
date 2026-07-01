const express = require('express');
const router = express.Router();
const {
  submitAssessment,
  getAssessmentHistory
} = require('../controllers/assessmentController');
const {
  validateAssessment,
  validateAssessmentHistory
} = require('../middleware/validators');

router.post('/submit', validateAssessment, submitAssessment);
router.get('/history/:userId', validateAssessmentHistory, getAssessmentHistory);

module.exports = router;
