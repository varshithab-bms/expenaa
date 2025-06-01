const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const profileRoutes = require('./routes/ProfileRoutes');

const app = express();

// CORS config for your frontend IP
app.use(cors({
  origin: 'http://192.168.43.111:5173',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

module.exports = app;
