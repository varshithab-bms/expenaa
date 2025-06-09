const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
app.listen(PORT, () => {
  console.log(`Server listening on port http://192.168.43.111:5173`);
});

  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}
startServer();