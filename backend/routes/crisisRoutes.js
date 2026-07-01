const express = require('express');
const router = express.Router();
const { getCrisisHotlines, getCrisisResources } = require('../controllers/crisisController');

router.get('/hotlines', getCrisisHotlines);
router.get('/resources', getCrisisResources);

module.exports = router;