const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret_admin";

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided or invalid format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    req.admin = decoded; // Attach decoded info to the request
    next(); // ✅ Important: proceed to the next middleware or route
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
