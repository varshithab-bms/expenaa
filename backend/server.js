const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  // Start server only after DB connects
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://192.168.43.111:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
