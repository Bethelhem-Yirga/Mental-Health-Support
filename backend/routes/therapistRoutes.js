const express = require('express');
const router = express.Router();
const { getAllTherapists, getTherapistById } = require('../controllers/therapistController');

// Make sure these are defined correctly
router.get('/', getAllTherapists);
router.get('/:id', getTherapistById);

module.exports = router;  // Export the router, not an object