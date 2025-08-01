const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  audio: {
    masterVolume: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 1
    },
    musicVolume: {
      type: Number,
      default: 0.5,
      min: 0,
      max: 1
    },
    sfxVolume: {
      type: Number,
      default: 0.8,
      min: 0,
      max: 1
    }
  },
  graphics: {
    quality: {
      type: String,
      enum: ['low', 'medium', 'high', 'ultra'],
      default: 'medium'
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    vsync: {
      type: Boolean,
      default: true
    },
    resolution: {
      width: {
        type: Number,
        default: 1920
      },
      height: {
        type: Number,
        default: 1080
      }
    }
  },
  gameplay: {
    difficulty: {
      type: String,
      enum: ['easy', 'normal', 'hard', 'expert'],
      default: 'normal'
    },
    autoSave: {
      type: Boolean,
      default: true
    },
    tutorial: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  controls: {
    sensitivity: {
      type: Number,
      default: 1.0,
      min: 0.1,
      max: 3.0
    },
    invertY: {
      type: Boolean,
      default: false
    },
    keyBindings: {
      type: Map,
      of: String,
      default: {}
    }
  },
  ui: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'dark'
    },
    showFPS: {
      type: Boolean,
      default: false
    },
    showDamage: {
      type: Boolean,
      default: true
    },
    showTutorial: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Method to get a specific setting
settingsSchema.methods.getSetting = function(path) {
  const keys = path.split('.');
  let value = this;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return null;
    }
  }
  
  return value;
};

// Method to set a specific setting
settingsSchema.methods.setSetting = function(path, value) {
  const keys = path.split('.');
  let current = this;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return this.save();
};

// Method to reset to default settings
settingsSchema.methods.resetToDefault = function() {
  this.audio = {
    masterVolume: 0.7,
    musicVolume: 0.5,
    sfxVolume: 0.8
  };
  
  this.graphics = {
    quality: 'medium',
    fullscreen: false,
    vsync: true,
    resolution: {
      width: 1920,
      height: 1080
    }
  };
  
  this.gameplay = {
    difficulty: 'normal',
    autoSave: true,
    tutorial: true,
    language: 'en'
  };
  
  this.controls = {
    sensitivity: 1.0,
    invertY: false,
    keyBindings: {}
  };
  
  this.ui = {
    theme: 'dark',
    showFPS: false,
    showDamage: true,
    showTutorial: true
  };
  
  return this.save();
};

module.exports = mongoose.model('Settings', settingsSchema); 