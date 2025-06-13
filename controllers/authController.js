const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // ✅ add this line

// @route   POST /api/auth/signup
// @desc    Register a new user
exports.signup = async (req, res) => {
  try {
    const {
      username,
      password,
      displayName,
      email,
      avatar,
      favClass,
      bio,
    } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

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
    const { username, password } = req.body;

    console.log("🔐 Login attempt:", username);

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful",
      token, // ✅ send token to frontend
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
