const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create user
router.post('/create', async (req, res) => {
  try {
    const user = new User();
    await user.save();
    res.status(201).json({
      success: true,
      data: {
        userId: user._id,
        anonymousId: user.anonymousId
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;