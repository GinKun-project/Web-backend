const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth"); // 🔒 Protect routes

// Admin Login (no auth needed)
router.post("/admin/login", adminController.loginAdmin);

// PLAYER CRUD (protected)
router.post("/admin/player", adminAuth, adminController.createPlayer);
router.put("/admin/player/:id", adminAuth, adminController.updatePlayer);
router.delete("/admin/player/:id", adminAuth, adminController.deletePlayer);

// CHARACTER CRUD (protected)
router.post("/admin/character", adminAuth, adminController.createCharacter);
router.put("/admin/character/:id", adminAuth, adminController.updateCharacter);
router.delete("/admin/character/:id", adminAuth, adminController.deleteCharacter);

module.exports = router;
