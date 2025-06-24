const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth"); // Protect routes

// Admin Login (no auth required)
router.post("/admin/login", adminController.loginAdmin);

// PLAYER CRUD (protected routes)
router.get("/admin/players", adminAuth, adminController.getAllPlayers);
router.post("/admin/players", adminAuth, adminController.createPlayer);
router.put("/admin/players/:id", adminAuth, adminController.updatePlayer);
router.delete("/admin/players/:id", adminAuth, adminController.deletePlayer);

// CHARACTER CRUD (protected routes)
router.get("/admin/characters", adminAuth, adminController.getAllCharacters); // ✅ newly added
router.post("/admin/characters", adminAuth, adminController.createCharacter);
router.put("/admin/characters/:id", adminAuth, adminController.updateCharacter);
router.delete("/admin/characters/:id", adminAuth, adminController.deleteCharacter);

module.exports = router;
