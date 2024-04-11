// db.js
const mongoose = require("mongoose");

const config = require("../Config/Config");

const connectDB = async () => {
  try {
    await mongoose.connect(config.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

module.exports = connectDB; // Export the connectDB function
