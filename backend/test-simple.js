const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

// Ultra simple schema
const SimpleUser = mongoose.model('SimpleUser', new mongoose.Schema({
  email: String,
  password: String,
  name: String
}));

// Routes
app.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new SimpleUser({
      email,
      password: hashedPassword,
      name
    });
    
    await user.save();
    
    const token = jwt.sign({ id: user._id }, 'test');
    
    res.json({ success: true, token, email: user.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(5002, () => console.log('Test server on 5002'));
  });
