const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes"); // Add admin routes

const app = express();

// Middleware BEFORE routes
app.use(cors());
app.use(express.json()); // Enables reading JSON bodies

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes); 

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
