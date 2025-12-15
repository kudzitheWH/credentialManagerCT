// src/server.js
// Entry point for backend: connects DB and starts Express server.

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const seedInitialData = require("./seed/seedData");
const app = require("./app");

const PORT = process.env.PORT || 5000;

async function start() {
  console.log(" Checking environment configuration...");
  console.log("MONGO_URI is:", process.env.MONGO_URI ? " Loaded" : " Missing");

  await connectDB();
  await seedInitialData();

  app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
  });
}

start();
