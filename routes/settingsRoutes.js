const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/auth');

// Get user settings
router.get('/', auth, settingsController.getUserSettings);

// Update user settings
router.put('/', auth, settingsController.updateUserSettings);

// Reset settings to default
router.delete('/reset', auth, settingsController.resetSettings);

module.exports = router; 