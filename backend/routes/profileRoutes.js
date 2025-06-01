const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require login
router.get('/', authMiddleware, profileController.getOwnProfile);
router.post('/', authMiddleware, profileController.createOrUpdateProfile);
router.delete('/', authMiddleware, profileController.deleteOwnProfile);

module.exports = router;
