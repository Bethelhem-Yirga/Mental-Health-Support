const express = require('express');
const router = express.Router();
const { getAllResources, getResourceById } = require('../controllers/resourceController');
const { cacheMiddleware } = require('../config/redis');

// Cache resources for 2 hours
router.get('/', cacheMiddleware(7200), getAllResources);
router.get('/:id', cacheMiddleware(7200), getResourceById);

module.exports = router;
