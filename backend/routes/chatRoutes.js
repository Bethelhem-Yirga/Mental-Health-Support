const express = require('express');
const router = express.Router();

// Chat routes (if needed for REST API)
router.get('/history', (req, res) => {
  res.json({ message: 'Chat history endpoint' });
});

module.exports = router;