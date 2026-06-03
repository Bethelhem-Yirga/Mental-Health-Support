const express = require('express');
const router = express.Router();
const {
  getAllTherapists,
  getTherapistById
} = require('../controllers/therapistController');
const {
  validateTherapistQuery,
  validateTherapistId
} = require('../middleware/validators');

router.get('/', validateTherapistQuery, getAllTherapists);
router.get('/:id', validateTherapistId, getTherapistById);

module.exports = router;
