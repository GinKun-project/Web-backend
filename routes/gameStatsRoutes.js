const express = require('express');
const router = express.Router();
const gameStatsController = require('../controllers/gameStatsController');
const auth = require('../middleware/auth');

// Get user game stats
router.get('/', auth, gameStatsController.getGameStats);

// Update game stats
router.put('/', auth, gameStatsController.updateGameStats);

// Record a game result
router.post('/record', auth, gameStatsController.recordGameResult);

// Reset game stats
router.delete('/reset', auth, gameStatsController.resetGameStats);

module.exports = router; 