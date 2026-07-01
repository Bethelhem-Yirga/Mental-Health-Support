const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create or get anonymous user
router.post('/anonymous', async (req, res) => {
  try {
    const user = new User();
    await user.save();
    
    res.status(201).json({
      success: true,
      data: {
        userId: user._id,
        anonymousId: user.anonymousId,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Anonymous error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get user by ID
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Update user preferences
router.put('/user/:userId/preferences', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    user.preferences = { ...user.preferences, ...req.body };
    await user.save();
    
    res.json({
      success: true,
      data: user.preferences
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
