const GameStats = require('../models/GameStats');

// Get game stats for a user
exports.getGameStats = async (req, res) => {
  try {
    const userId = req.user._id;
    let gameStats = await GameStats.findOne({ userId });
    
    if (!gameStats) {
      gameStats = new GameStats({ userId });
      await gameStats.save();
    }
    
    res.json({
      success: true,
      data: gameStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching game stats',
      error: error.message
    });
  }
};

// Update game stats
exports.updateGameStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { wins, losses, totalMatches, aiWins, perfectWins, fastestWin, comebackWins } = req.body;
    
    let gameStats = await GameStats.findOne({ userId });
    
    if (!gameStats) {
      gameStats = new GameStats({ userId });
    }
    
    // Update stats
    if (wins !== undefined) gameStats.wins = wins;
    if (losses !== undefined) gameStats.losses = losses;
    if (totalMatches !== undefined) gameStats.totalMatches = totalMatches;
    if (aiWins !== undefined) gameStats.aiWins = aiWins;
    if (perfectWins !== undefined) gameStats.perfectWins = perfectWins;
    if (fastestWin !== undefined) gameStats.fastestWin = fastestWin;
    if (comebackWins !== undefined) gameStats.comebackWins = comebackWins;
    
    await gameStats.save();
    
    res.json({
      success: true,
      data: gameStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating game stats',
      error: error.message
    });
  }
};

// Record a game result
exports.recordGameResult = async (req, res) => {
  try {
    const userId = req.user._id;
    const { result, gameType, duration, damageTaken, isPerfectWin, isComeback } = req.body;
    
    let gameStats = await GameStats.findOne({ userId });
    
    if (!gameStats) {
      gameStats = new GameStats({ userId });
    }
    
    // Update basic stats
    gameStats.totalMatches += 1;
    
    if (result === 'win') {
      gameStats.wins += 1;
      
      if (gameType === 'ai') {
        gameStats.aiWins += 1;
      }
      
      if (isPerfectWin) {
        gameStats.perfectWins += 1;
      }
      
      if (isComeback) {
        gameStats.comebackWins += 1;
      }
      
      // Update fastest win time
      if (duration && (!gameStats.fastestWin || duration < gameStats.fastestWin)) {
        gameStats.fastestWin = duration;
      }
    } else {
      gameStats.losses += 1;
    }
    
    await gameStats.save();
    
    res.json({
      success: true,
      data: gameStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording game result',
      error: error.message
    });
  }
};

// Reset game stats
exports.resetGameStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    await GameStats.findOneAndUpdate(
      { userId },
      {
        wins: 0,
        losses: 0,
        totalMatches: 0,
        aiWins: 0,
        perfectWins: 0,
        fastestWin: null,
        comebackWins: 0
      },
      { upsert: true, new: true }
    );
    
    res.json({
      success: true,
      message: 'Game stats reset successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting game stats',
      error: error.message
    });
  }
}; 