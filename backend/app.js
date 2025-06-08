require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const app = express();

// ✅ Required to parse JSON request bodies
app.use(express.json());

console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Optional: log every request
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://192.168.43.111:5173',
    'https://expenza-omega.vercel.app',
    'https://expenza-git-main-varshitha-bs-projects.vercel.app',
    'https://expenza-o43mucqug-varshitha-bs-projects.vercel.app'
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Allow preflight

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Test routes
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

app.get('/api/public-test', (req, res) => {
  res.json({ message: 'No token needed here!' });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;