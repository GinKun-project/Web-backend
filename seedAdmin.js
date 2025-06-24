const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/Admin");
require("dotenv").config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists. Skipping.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("password", 10);

    const newAdmin = new Admin({
      username: "admin",
      password: hashedPassword,
    });

    await newAdmin.save();
    console.log("✅ Admin created: username=admin | password=password");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message || err);
    process.exit(1);
  }
}

seedAdmin();
