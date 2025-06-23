const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @route   POST /api/auth/signup
// @desc    Register a new user
exports.signup = async (req, res) => {
  try {
    console.log("📦 Signup request body:", req.body);

    const {
      username,
      password,
      displayName,
      email,
      avatar,
      favClass,
      bio,
    } = req.body;

    // Basic validation
    if (!username || !password || !email) {
      return res.status(400).json({ message: "Username, email, and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      displayName,
      email,
      avatar,
      favClass,
      bio,
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("❌ Signup error:", error.message || error);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   POST /api/auth/login
// @desc    Login user and return JWT
exports.login = async (req, res) => {
  try {
    // Log incoming request body
    console.log("📦 Login request body:", req.body);

    // Ensure body is parsed
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Invalid request format." });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "3d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        favClass: user.favClass,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message || error);
    res.status(500).json({ message: "Server error" });
  }
};
