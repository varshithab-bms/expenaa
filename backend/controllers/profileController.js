// Inside backend/controllers/profileController.js
const Profile = require('../models/Profile');



exports.getOwnProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { name, bio, photo } = req.body;

    const existing = await Profile.findOne({ userId: req.user.id });

    if (existing) {
      // Update
      existing.name = name;
      existing.bio = bio;
      existing.photo = photo;
      const updated = await existing.save();
      return res.json(updated);
    }

    // Create
    const newProfile = new Profile({
      userId: req.user.id,
      email: req.user.email, // from JWT payload
      name,
      bio,
      photo
    });
    const saved = await newProfile.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteOwnProfile = async (req, res) => {
  try {
    const deleted = await Profile.findOneAndDelete({ userId: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Profile not found' });
    res.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
