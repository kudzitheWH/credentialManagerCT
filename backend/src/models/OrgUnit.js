// src/models/OrgUnit.js
const mongoose = require("mongoose");

// -----------------------------
// OrgUnit Schema
// Represents a top-level organisational group (e.g. 'News management', 'Hardware reviews')
// -----------------------------
const OrgUnitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OrgUnit", OrgUnitSchema);
