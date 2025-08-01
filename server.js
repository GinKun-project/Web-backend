const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const gameStatsRoutes = require("./routes/gameStatsRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();

// Middleware BEFORE routes
app.use(cors());
app.use(express.json()); // Enables reading JSON bodies

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/gameStats", gameStatsRoutes);
app.use("/api/settings", settingsRoutes); 

// Connect to MongoDB and Start Server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});
