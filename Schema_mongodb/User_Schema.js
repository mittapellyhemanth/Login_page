// userModel.js
const { strict } = require("assert");
const mongoose = require("mongoose");
const { type } = require("os");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
