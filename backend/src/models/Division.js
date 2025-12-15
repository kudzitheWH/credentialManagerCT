// src/models/Division.js
const mongoose = require("mongoose");

// -----------------------------
// Division Schema
// Each Division belongs to ONE OrgUnit (like 'IT', 'Finance')
// -----------------------------
const DivisionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Link to parent organisational unit
    orgUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrgUnit",
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model("Division", DivisionSchema);
