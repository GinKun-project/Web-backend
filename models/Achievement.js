const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievementId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['combat', 'progression', 'collection', 'social', 'special']
  },
  rarity: {
    type: String,
    required: true,
    enum: ['common', 'rare', 'epic', 'legendary']
  },
  icon: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  unlocked: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  maxProgress: {
    type: Number,
    required: true
  },
  unlockedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Compound index to ensure unique achievement per user
achievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

// Static method to get or create achievement
achievementSchema.statics.getOrCreate = async function(userId, achievementData) {
  let achievement = await this.findOne({ userId, achievementId: achievementData.id });
  
  if (!achievement) {
    achievement = new this({
      userId,
      achievementId: achievementData.id,
      title: achievementData.title,
      description: achievementData.description,
      category: achievementData.category,
      rarity: achievementData.rarity,
      icon: achievementData.icon,
      points: achievementData.points,
      maxProgress: achievementData.maxProgress
    });
    await achievement.save();
  }
  
  return achievement;
};

// Static method to update progress
achievementSchema.statics.updateProgress = async function(userId, achievementId, progress) {
  const achievement = await this.findOne({ userId, achievementId });
  
  if (!achievement) {
    throw new Error('Achievement not found');
  }
  
  achievement.progress = Math.min(progress, achievement.maxProgress);
  
  // Check if achievement should be unlocked
  if (achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.unlockedAt = new Date();
  }
  
  await achievement.save();
  return achievement;
};

// Static method to unlock achievement
achievementSchema.statics.unlock = async function(userId, achievementId) {
  const achievement = await this.findOne({ userId, achievementId });
  
  if (!achievement) {
    throw new Error('Achievement not found');
  }
  
  if (!achievement.unlocked) {
    achievement.unlocked = true;
    achievement.unlockedAt = new Date();
    achievement.progress = achievement.maxProgress;
    await achievement.save();
  }
  
  return achievement;
};

module.exports = mongoose.model('Achievement', achievementSchema); 