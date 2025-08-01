const mongoose = require('mongoose');

const gameStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  totalMatches: {
    type: Number,
    default: 0
  },
  aiWins: {
    type: Number,
    default: 0
  },
  perfectWins: {
    type: Number,
    default: 0
  },
  fastestWin: {
    type: Number, // in seconds
    default: null
  },
  comebackWins: {
    type: Number,
    default: 0
  },
  averageMatchDuration: {
    type: Number,
    default: 0
  },
  totalPlayTime: {
    type: Number, // in minutes
    default: 0
  },
  lastPlayed: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Virtual for win rate
gameStatsSchema.virtual('winRate').get(function() {
  if (this.totalMatches === 0) return 0;
  return (this.wins / this.totalMatches * 100).toFixed(2);
});

// Virtual for total points (for achievements)
gameStatsSchema.virtual('totalPoints').get(function() {
  return this.wins * 10 + this.perfectWins * 25 + this.aiWins * 5;
});

// Method to update stats after a game
gameStatsSchema.methods.updateAfterGame = function(gameData) {
  this.totalMatches += 1;
  this.lastPlayed = new Date();
  
  if (gameData.result === 'win') {
    this.wins += 1;
    
    if (gameData.gameType === 'ai') {
      this.aiWins += 1;
    }
    
    if (gameData.isPerfectWin) {
      this.perfectWins += 1;
    }
    
    if (gameData.isComeback) {
      this.comebackWins += 1;
    }
    
    // Update fastest win
    if (gameData.duration && (!this.fastestWin || gameData.duration < this.fastestWin)) {
      this.fastestWin = gameData.duration;
    }
  } else {
    this.losses += 1;
  }
  
  // Update average match duration
  if (gameData.duration) {
    const totalDuration = this.averageMatchDuration * (this.totalMatches - 1) + gameData.duration;
    this.averageMatchDuration = totalDuration / this.totalMatches;
  }
  
  // Update total play time
  if (gameData.duration) {
    this.totalPlayTime += gameData.duration / 60; // Convert to minutes
  }
  
  return this.save();
};

module.exports = mongoose.model('GameStats', gameStatsSchema); 