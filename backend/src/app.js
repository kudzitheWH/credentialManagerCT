// src/app.js
// ------------------------------------------------------
// Main Express Application Entry Point
// ------------------------------------------------------

const express = require("express");
const cors = require("cors");

// Route imports
const authRoutes = require("./routes/authRoutes");
const credentialRoutes = require("./routes/credential.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// ------------------------------------------------------
// Middleware setup
// ------------------------------------------------------
app.use(cors());
app.use(express.json());

// Debugging middleware (useful during development)
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// ------------------------------------------------------
// Base route (health check)
// ------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Cool Tech Credential Manager API is running");
});

// ------------------------------------------------------
// Route Registration
// ------------------------------------------------------

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes (secured by middleware inside)
app.use("/api", credentialRoutes);
app.use("/api", adminRoutes);

module.exports = app;
