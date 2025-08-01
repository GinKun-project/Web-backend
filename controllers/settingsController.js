const Settings = require('../models/Settings');

// Get user settings
exports.getUserSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    let settings = await Settings.findOne({ userId });
    
    if (!settings) {
      // Create default settings
      settings = new Settings({
        userId,
        audio: {
          masterVolume: 0.7,
          musicVolume: 0.5,
          sfxVolume: 0.8
        },
        graphics: {
          quality: 'medium',
          fullscreen: false,
          vsync: true
        },
        gameplay: {
          difficulty: 'normal',
          autoSave: true,
          tutorial: true
        },
        controls: {
          sensitivity: 1.0,
          invertY: false,
          keyBindings: {}
        }
      });
      await settings.save();
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

// Update user settings
exports.updateUserSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { audio, graphics, gameplay, controls } = req.body;
    
    let settings = await Settings.findOne({ userId });
    
    if (!settings) {
      settings = new Settings({ userId });
    }
    
    // Update settings
    if (audio) settings.audio = { ...settings.audio, ...audio };
    if (graphics) settings.graphics = { ...settings.graphics, ...graphics };
    if (gameplay) settings.gameplay = { ...settings.gameplay, ...gameplay };
    if (controls) settings.controls = { ...settings.controls, ...controls };
    
    await settings.save();
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

// Reset settings to default
exports.resetSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const defaultSettings = {
      audio: {
        masterVolume: 0.7,
        musicVolume: 0.5,
        sfxVolume: 0.8
      },
      graphics: {
        quality: 'medium',
        fullscreen: false,
        vsync: true
      },
      gameplay: {
        difficulty: 'normal',
        autoSave: true,
        tutorial: true
      },
      controls: {
        sensitivity: 1.0,
        invertY: false,
        keyBindings: {}
      }
    };
    
    await Settings.findOneAndUpdate(
      { userId },
      defaultSettings,
      { upsert: true, new: true }
    );
    
    res.json({
      success: true,
      message: 'Settings reset to default successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting settings',
      error: error.message
    });
  }
}; 