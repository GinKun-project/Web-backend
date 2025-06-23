const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware (must be before routes)
app.use(cors());
app.use(express.json()); // ✅ Important: Parse incoming JSON

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("🚀 Server running on port " + (process.env.PORT || 5000));
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
