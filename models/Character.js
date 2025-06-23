const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  power: { type: Number, required: true },
  rarity: { type: String, enum: ["common", "rare", "epic", "legendary"], default: "common" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Character", characterSchema);
