const Settings = require('./models/Settings');
const mongoose = require('mongoose');

// Test function to create default settings
async function createDefaultSettings(userId) {
  try {
    const settings = new Settings({
      userId,
      audio: {
        masterVolume: 0.7,
        musicVolume: 0.5,
        sfxVolume: 0.8
      },
      graphics: {
        quality: 'medium',
        fullscreen: false,
        vsync: true,
        resolution: {
          width: 1920,
          height: 1080
        }
      },
      gameplay: {
        difficulty: 'normal',
        autoSave: true,
        tutorial: true,
        language: 'en'
      },
      controls: {
        sensitivity: 1.0,
        invertY: false,
        keyBindings: {}
      },
      ui: {
        theme: 'dark',
        showFPS: false,
        showDamage: true,
        showTutorial: true
      }
    });

    await settings.save();
    console.log('Default settings created for user:', userId);
    return settings;
  } catch (error) {
    console.error('Error creating default settings:', error);
    throw error;
  }
}

// Test function to update settings
async function updateSettings(userId, updates) {
  try {
    const settings = await Settings.findOne({ userId });
    
    if (!settings) {
      console.log('Settings not found, creating default settings...');
      return await createDefaultSettings(userId);
    }

    // Update settings
    if (updates.audio) {
      settings.audio = { ...settings.audio, ...updates.audio };
    }
    if (updates.graphics) {
      settings.graphics = { ...settings.graphics, ...updates.graphics };
    }
    if (updates.gameplay) {
      settings.gameplay = { ...settings.gameplay, ...updates.gameplay };
    }
    if (updates.controls) {
      settings.controls = { ...settings.controls, ...updates.controls };
    }
    if (updates.ui) {
      settings.ui = { ...settings.ui, ...updates.ui };
    }

    await settings.save();
    console.log('Settings updated for user:', userId);
    return settings;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

// Test function to get settings
async function getSettings(userId) {
  try {
    const settings = await Settings.findOne({ userId });
    
    if (!settings) {
      console.log('Settings not found, creating default settings...');
      return await createDefaultSettings(userId);
    }

    console.log('Settings retrieved for user:', userId);
    return settings;
  } catch (error) {
    console.error('Error getting settings:', error);
    throw error;
  }
}

// Test function to reset settings
async function resetSettings(userId) {
  try {
    const settings = await Settings.findOne({ userId });
    
    if (!settings) {
      console.log('Settings not found, creating default settings...');
      return await createDefaultSettings(userId);
    }

    await settings.resetToDefault();
    console.log('Settings reset for user:', userId);
    return settings;
  } catch (error) {
    console.error('Error resetting settings:', error);
    throw error;
  }
}

module.exports = {
  createDefaultSettings,
  updateSettings,
  getSettings,
  resetSettings
}; 