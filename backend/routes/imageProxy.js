const express = require('express');
const router = express.Router();
const axios = require('axios');

// Proxy endpoint to avoid CORS issues with external images
router.get('/proxy', async (req, res) => {
  const imageUrl = req.query.url;
  
  if (!imageUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }
  
  try {
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MindSpaceBot/1.0)'
      }
    });
    
    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    console.error('Image proxy error:', error.message);
    res.status(404).json({ error: 'Image not found' });
  }
});

module.exports = router;
