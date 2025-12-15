// src/controllers/credential.controller.js
// ------------------------------------------------------
// Logic for viewing / creating / updating credentials
// ------------------------------------------------------

const Credential = require("../models/Credential");
const Division = require("../models/Division");
const User = require("../models/User");

// ------------------------------------------------------
//  Get all credentials for a logged-in user's divisions
// ------------------------------------------------------
async function getMyCredentials(req, res) {
  try {
    console.log("GET /api/credentials/my called by:", req.user?.name);

    const user = await User.findById(req.user.id).populate("divisions", "name");
    if (!user) return res.status(404).json({ msg: "User not found." });

    if (!user.divisions || user.divisions.length === 0) {
      console.warn("No divisions assigned for user:", user.name);
      return res.status(403).json({ msg: "No divisions assigned to your account." });
    }

    const divisionIds = user.divisions.map((d) => d._id);
    const creds = await Credential.find({ division: { $in: divisionIds } })
      .populate("division", "name")
      .lean();

    console.log(`Found ${creds.length} credentials for ${user.name}`);
    return res.json(creds);
  } catch (err) {
    console.error("Error in getMyCredentials:", err.message);
    return res.status(500).json({ msg: "Error loading credentials." });
  }
}

// ------------------------------------------------------
//  Get credentials by specific division
// ------------------------------------------------------
async function getCredentialsByDivision(req, res) {
  try {
    const { divisionId } = req.params;

    if (req.user.role === "normal") {
      const userDivisions = Array.isArray(req.user.divisions)
        ? req.user.divisions.map(String)
        : [];

      if (!userDivisions.includes(String(divisionId))) {
        return res
          .status(403)
          .json({ msg: "You can only view credentials for your own division." });
      }
    }

    const creds = await Credential.find({ division: divisionId }).populate("division", "name");
    return res.json(creds);
  } catch (err) {
    console.error("getCredentialsByDivision error:", err.message);
    return res.status(500).json({ msg: "Server error loading credentials." });
  }
}

// ------------------------------------------------------
//  Create new credential
// ------------------------------------------------------
async function createCredential(req, res) {
  try {
    const { divisionId } = req.params;
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ msg: "Username and password are required." });

    const division = await Division.findById(divisionId);
    if (!division) return res.status(404).json({ msg: "Division not found." });

    const cred = await Credential.create({ division: divisionId, username, password });
    console.log(`✅ Created new credential for division ${division.name}`);
    return res.status(201).json(cred);
  } catch (err) {
    console.error("createCredential error:", err.message);
    return res.status(500).json({ msg: "Server error creating credential." });
  }
}

// ------------------------------------------------------
//  Update existing credential
// ------------------------------------------------------
async function updateCredential(req, res) {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const cred = await Credential.findById(id);
    if (!cred) return res.status(404).json({ msg: "Credential not found." });

    if (username !== undefined) cred.username = username;
    if (password !== undefined) cred.password = password;

    await cred.save();
    console.log(`Updated credential ${cred._id}`);
    return res.json(cred);
  } catch (err) {
    console.error("updateCredential error:", err.message);
    return res.status(500).json({ msg: "Server error updating credential." });
  }
}

module.exports = {
  getMyCredentials,
  getCredentialsByDivision,
  createCredential,
  updateCredential,
};
