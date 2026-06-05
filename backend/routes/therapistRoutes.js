const express = require('express');
const router = express.Router();
const { getAllTherapists, getTherapistById } = require('../controllers/therapistController');
const { cacheMiddleware } = require('../config/redis');

// Cache therapist list for 1 hour
router.get('/', cacheMiddleware(3600), getAllTherapists);
router.get('/:id', cacheMiddleware(3600), getTherapistById);

module.exports = router;
