// src/controllers/admin.controller.js
// ------------------------------------------------------
// Admin-only controller for managing users and divisions
// ------------------------------------------------------

const User = require("../models/User");
const Division = require("../models/Division");
const OrgUnit = require("../models/OrgUnit");

// --------------------
// Assign a user to a division
// PATCH /api/admin/users/:userId/division
// --------------------
async function assignUserToDivision(req, res) {
  try {
    const { userId } = req.params;
    const { divisionId } = req.body;

    if (!divisionId) {
      return res.status(400).json({ msg: "divisionId is required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found." });

    const division = await Division.findById(divisionId);
    if (!division) return res.status(404).json({ msg: "Division not found." });

    // ✅ Assign division (array-based field)
    if (!user.divisions.includes(divisionId)) {
      user.divisions = [divisionId]; // replace or set first assignment
      await user.save();
    }

    console.log(`Assigned ${user.name} to division ${division.name}`);

    return res.json({
      msg: `User '${user.name}' assigned to division '${division.name}'.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        divisions: user.divisions,
      },
    });
  } catch (err) {
    console.error("Error assigning user to division:", err.message);
    return res.status(500).json({ msg: "Server error assigning user to division." });
  }
}

// --------------------
// Remove a user from a division
// PATCH /api/admin/users/:userId/division/remove
// --------------------
async function removeUserFromDivision(req, res) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found." });

    if (!user.divisions || user.divisions.length === 0) {
      return res.status(400).json({ msg: "User is not assigned to any division." });
    }

    user.divisions = [];
    await user.save();

    console.log(`🚫 Removed ${user.name} from their division`);

    return res.json({
      msg: `User '${user.name}' removed from all divisions.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        divisions: user.divisions,
      },
    });
  } catch (err) {
    console.error("Error removing user from division:", err.message);
    return res.status(500).json({ msg: "Server error removing user from division." });
  }
}

// --------------------
// Change a user's role
// PATCH /api/admin/users/:userId/role
// --------------------
async function changeUserRole(req, res) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const allowedRoles = ["normal", "management", "admin"];
    if (!allowedRoles.includes(role)) {
      console.warn(`Invalid role specified: ${role}`);
      return res.status(400).json({ msg: "Invalid role specified." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found." });

    user.role = role;
    await user.save();

    console.log(`Role updated: '${user.name}' is now '${role.toUpperCase()}'`);
    return res.json({
      msg: `User '${user.name}' role updated to '${role}'.`,
      updatedUser: { id: user._id, name: user.name, role: user.role }, // return updated user info
    });
  } catch (err) {
    console.error("Error changing user role:", err.message);
    res.status(500).json({ msg: "Server error updating user role." });
  }
}


// Export all functions together
module.exports = {
  assignUserToDivision,
  removeUserFromDivision,
  changeUserRole,
};
