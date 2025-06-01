const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const generateToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ token: generateToken(user) });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ error: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ token: generateToken(user) });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: 'Login failed' });
  }
};
