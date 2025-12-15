// src/routes/authRoutes.js
// ------------------------------------------------------
// Handles authentication & registration logic
// for Cool Tech Credential Manager.
// ------------------------------------------------------

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const OrgUnit = require("../models/OrgUnit");
const Division = require("../models/Division");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ------------------------------------------------------
// Helper: Generate a signed JWT
// ------------------------------------------------------
async function signToken(user) {
  // Populate division and orgUnit names before embedding in token
  await user.populate([
    { path: "orgUnits", select: "name" },
    { path: "divisions", select: "name" },
  ]);

  const payload = {
    id: user._id,
    name: user.name,
    role: user.role,
    orgUnits: user.orgUnits.map((ou) => ou.name),
    divisions: user.divisions.map((d) => d.name),
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "2h",
  });
}

// ------------------------------------------------------
// POST /api/auth/register
// Register a new user (default role: "normal")
// ------------------------------------------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, orgUnitId, divisionId } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ msg: "Name, email, and password are required." });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ msg: "A user with that email already exists." });
    }

    // Secure password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      role: "normal",
      passwordHash: hashedPassword,
      orgUnits: orgUnitId ? [orgUnitId] : [],
      divisions: divisionId ? [divisionId] : [],
    });

    await user.save();

    const token = signToken(user);

    return res.status(201).json({
      msg: "Registration successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).json({ msg: "Error registering user." });
  }
});

// ------------------------------------------------------
// POST /api/auth/login
// Logs in user and returns JWT
// ------------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    // include passwordHash so we can validate
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      return res.status(403).json({ msg: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(403).json({ msg: "Invalid email or password." });
    }

    // Populate division + orgUnit names before signing
    await user.populate([
      { path: "divisions", select: "name" },
      { path: "orgUnits", select: "name" },
    ]);

    // build the token payload using names not IDs
    const payload = {
      id: user._id,
      name: user.name,
      role: user.role,
      divisions: user.divisions.map((d) => d.name),
      orgUnits: user.orgUnits.map((o) => o.name),
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "2h",
    });

    console.log(`${user.name} logged in successfully`);
    return res.json({
      msg: "Login successful.",
      token,
      user: payload,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: "Error logging in." });
  }
});
// ------------------------------------------------------
// GET /api/auth/org-structure
// Returns org units & divisions (public endpoint)
// ------------------------------------------------------
router.get("/org-structure", async (req, res) => {
  try {
    const orgUnits = await OrgUnit.find().lean();
    const divisions = await Division.find().lean();
    return res.json({ orgUnits, divisions });
  } catch (err) {
    console.error("Org structure error:", err.message);
    return res
      .status(500)
      .json({ msg: "Error loading organisational structure." });
  }
});

module.exports = router;
