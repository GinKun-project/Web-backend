const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const auth = require('../middleware/auth');

// Get user achievements
router.get('/user', auth, achievementController.getUserAchievements);

// Update achievement progress
router.put('/progress/:achievementId', auth, achievementController.updateAchievementProgress);

// Unlock achievement
router.put('/unlock/:achievementId', auth, achievementController.unlockAchievement);

// Get achievement stats
router.get('/stats', auth, achievementController.getAchievementStats);

// Reset achievements
router.delete('/reset', auth, achievementController.resetAchievements);

// Check and update achievements based on game stats
router.post('/check', auth, achievementController.checkAndUpdateAchievements);

// Admin routes for managing achievements
router.get('/', auth, achievementController.getAllAchievements);
router.get('/:id', auth, achievementController.getAchievementById);
router.post('/', auth, achievementController.createAchievement);
router.put('/:id', auth, achievementController.updateAchievement);
router.delete('/:id', auth, achievementController.deleteAchievement);

module.exports = router; 