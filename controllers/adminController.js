const Admin = require("../models/Admin");
const Player = require("../models/Player");
const Character = require("../models/Character");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "secret_admin";

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      username: admin.username,
    });
  } catch (err) {
    console.error("❌ Admin login error:", err.message || err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PLAYER CRUD
exports.createPlayer = async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json({ success: true, data: player });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updatePlayer = async (req, res) => {
  try {
    const updated = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Player not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deletePlayer = async (req, res) => {
  try {
    const deleted = await Player.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Player not found" });
    res.json({ success: true, message: "Player deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// CHARACTER CRUD
exports.createCharacter = async (req, res) => {
  try {
    const character = new Character(req.body);
    await character.save();
    res.status(201).json({ success: true, data: character });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateCharacter = async (req, res) => {
  try {
    const updated = await Character.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Character not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteCharacter = async (req, res) => {
  try {
    const deleted = await Character.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Character not found" });
    res.json({ success: true, message: "Character deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
