// src/models/User.js
const mongoose = require("mongoose");

// -----------------------------
// User Schema
// Supports role-based access and
// multiple org units / divisions.
// Roles:
//  - "normal"      : can read + add credentials
//  - "management"  : normal rights + update credentials
//  - "admin"       : management rights + manage users/divisions
// -----------------------------
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // hide from normal queries
    },
    role: {
      type: String,
      enum: ["normal", "management", "admin"],
      default: "normal",
    },
    orgUnits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrgUnit",
      },
    ],
    divisions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Division",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
