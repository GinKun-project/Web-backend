const Achievement = require('../models/Achievement');

// Get all achievements
exports.getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching achievements', error: error.message });
  }
};

// Get achievement by ID
exports.getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching achievement', error: error.message });
  }
};

// Create new achievement
exports.createAchievement = async (req, res) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ message: 'Error creating achievement', error: error.message });
  }
};

// Update achievement
exports.updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.json(achievement);
  } catch (error) {
    res.status(400).json({ message: 'Error updating achievement', error: error.message });
  }
};

// Delete achievement
exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting achievement', error: error.message });
  }
};

// Get user achievements
exports.getUserAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    const achievements = await Achievement.find({ userId });
    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user achievements',
      error: error.message
    });
  }
};

// Update achievement progress
exports.updateAchievementProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { achievementId } = req.params;
    const { progress } = req.body;
    
    const achievement = await Achievement.updateProgress(userId, achievementId, progress);
    
    res.json({
      success: true,
      data: achievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating achievement progress',
      error: error.message
    });
  }
};

// Unlock achievement
exports.unlockAchievement = async (req, res) => {
  try {
    const userId = req.user._id;
    const { achievementId } = req.params;
    
    const achievement = await Achievement.unlock(userId, achievementId);
    
    res.json({
      success: true,
      data: achievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unlocking achievement',
      error: error.message
    });
  }
};

// Get achievement stats
exports.getAchievementStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const achievements = await Achievement.find({ userId });
    
    const stats = {
      total: achievements.length,
      unlocked: achievements.filter(a => a.unlocked).length,
      locked: achievements.filter(a => !a.unlocked).length,
      totalPoints: achievements.reduce((sum, a) => sum + (a.unlocked ? a.points : 0), 0)
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement stats',
      error: error.message
    });
  }
};

// Reset achievements
exports.resetAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    await Achievement.deleteMany({ userId });
    
    res.json({
      success: true,
      message: 'Achievements reset successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting achievements',
      error: error.message
    });
  }
};

// Check and update achievements based on game stats
exports.checkAndUpdateAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    const gameStats = req.body;
    
    const updatedAchievements = [];
    
    // Check First Blood achievement
    if (gameStats.wins > 0) {
      const firstBlood = await Achievement.findOne({ userId, achievementId: "first_blood" });
      if (firstBlood && !firstBlood.unlocked) {
        await Achievement.unlock(userId, "first_blood");
        updatedAchievements.push("First Blood");
      }
    }
    
    // Check AI Slayer achievement
    if (gameStats.aiWins > 0) {
      const aiSlayer = await Achievement.findOne({ userId, achievementId: "ai_slayer" });
      if (aiSlayer) {
        const newProgress = Math.min(aiSlayer.progress + gameStats.aiWins, 10);
        await Achievement.updateProgress(userId, "ai_slayer", newProgress);
        
        if (newProgress >= 10 && !aiSlayer.unlocked) {
          updatedAchievements.push("AI Slayer");
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        updatedAchievements,
        count: updatedAchievements.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking achievements',
      error: error.message
    });
  }
}; 