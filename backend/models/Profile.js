const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  bio: String,
  photo: String,
  // Add user ID if you have separate user accounts
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }
});

module.exports = mongoose.model('Profile', profileSchema);
