const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Player", playerSchema);

