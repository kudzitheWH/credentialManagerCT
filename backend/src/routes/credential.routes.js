// src/routes/credential.routes.js
// ------------------------------------------------------
// Routes for managing credentials by division or user
// ------------------------------------------------------

const express = require("express");
const router = express.Router();

const { authRequired, requireRole } = require("../middleware/auth");
const {
  getMyCredentials,
  getCredentialsByDivision,
  createCredential,
  updateCredential,
} = require("../controllers/credential.controller");

// ------------------------------------------------------
// NORMAL USERS
// ------------------------------------------------------
// Logged-in users can view credentials for their assigned divisions
router.get("/credentials/my", authRequired, getMyCredentials);

// Normal users can also view credentials by specific division (if assigned)
router.get(
  "/divisions/:divisionId/credentials",
  authRequired,
  getCredentialsByDivision
);

// ------------------------------------------------------
// MANAGEMENT + ADMIN USERS
// ------------------------------------------------------
// Management + Admin users can create credentials
router.post(
  "/divisions/:divisionId/credentials",
  authRequired,
  requireRole("management", "admin"),
  createCredential
);

// Management + Admin users can update credentials
router.put(
  "/credentials/:id",
  authRequired,
  requireRole("management", "admin"),
  updateCredential
);

// ------------------------------------------------------
// Export
// ------------------------------------------------------
module.exports = router;
