// src/routes/admin.routes.js
// ------------------------------------------------------
// Admin Routes: Manage users, divisions, and orgUnits
// ------------------------------------------------------

const express = require("express");
const router = express.Router();

const {
  assignUserToDivision,
  removeUserFromDivision,
  changeUserRole, // new function
} = require("../controllers/admin.controller");

const { authRequired, requireRole } = require("../middleware/auth");
const User = require("../models/User");
const Division = require("../models/Division");
const OrgUnit = require("../models/OrgUnit");

// ------------------------------------------------------
// Protect all admin routes
// ------------------------------------------------------
router.use(authRequired, requireRole("admin"));

router.patch("/admin/users/:userId/role", changeUserRole);


// ------------------------------------------------------
//  Admin Dashboard Data
// ------------------------------------------------------

// GET /api/admin/users
router.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ msg: "Error fetching users" });
  }
});

// GET /api/admin/divisions
router.get("/admin/divisions", async (req, res) => {
  try {
    const divisions = await Division.find();
    res.json(divisions);
  } catch (err) {
    console.error("Error fetching divisions:", err.message);
    res.status(500).json({ msg: "Error fetching divisions" });
  }
});

// GET /api/admin/orgUnits
router.get("/admin/orgUnits", async (req, res) => {
  try {
    const orgUnits = await OrgUnit.find();
    res.json(orgUnits);
  } catch (err) {
    console.error("Error fetching orgUnits:", err.message);
    res.status(500).json({ msg: "Error fetching orgUnits" });
  }
});

// ------------------------------------------------------
//  PATCH ROUTES (Division & Role Management)
// ------------------------------------------------------

// Assign or remove division
router.patch("/admin/users/:userId/division", assignUserToDivision);
router.patch("/admin/users/:userId/division/remove", removeUserFromDivision);

// Change user role (admin-only)
router.patch("/admin/users/:userId/role", async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["normal", "admin"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role specified." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found." });
    }

    console.log(`Updated role for ${updatedUser.name} → ${updatedUser.role}`);
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user role:", err.message);
    res.status(500).json({ msg: "Error updating user role." });
  }
});

module.exports = router;
