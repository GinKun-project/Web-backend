const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: String,
  email: String,
  avatar: String,
  favClass: String,
  bio: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
