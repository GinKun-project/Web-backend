const mongoose = require("mongoose");

const CharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
});

module.exports = mongoose.model("Character", CharacterSchema);
