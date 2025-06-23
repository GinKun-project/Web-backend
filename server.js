const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const adminRoutes = require("./routes/adminRoutes");
app.use("/api", adminRoutes);


const app = express();
app.use(cors());
app.use(express.json()); // parse incoming JSON

// Routes
app.use("/api/auth", authRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("🚀 Server running on port " + (process.env.PORT || 5000));
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
