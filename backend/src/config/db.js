// src/config/db.js
const mongoose = require("mongoose");

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("❌ MONGO_URI not found in .env file");
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ Mongo connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
