// src/models/Credential.js
// Credential model – stores login data linked to a division

const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema(
  {
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Credential", credentialSchema);
