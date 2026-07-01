const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

// Simple User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('TestUser', userSchema);

// Routes
app.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = new User({ email, password, name });
    await user.save();
    const token = jwt.sign({ id: user._id }, 'test-secret');
    res.json({ success: true, token, user: { email, name } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, error: 'User not found' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, error: 'Invalid password' });
    
    const token = jwt.sign({ id: user._id }, 'test-secret');
    res.json({ success: true, token, user: { email, name: user.name } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Connect and start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(5001, () => console.log('Test server on port 5001'));
    console.log('✅ Test server ready!');
  });
