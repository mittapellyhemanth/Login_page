// Import the required modules
const express = require("express");
const UserModel = require("../Schema_mongodb/User_Schema");
const bcrypt = require("bcrypt");

// Create an instance of the router
const UserRegister = express.Router();

// Define the route handler
UserRegister.post("/register", async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.(com|in|org|net|gov|edu)$/i;

  // Check if the email field is empty or does not match the email format
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format or domain" });
  }

  // Check if the password field is empty or does not meet the requirements
  const minLength = 8; // Minimum password length requirement
  const specialCharacters = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/; // Regular expression for special characters
  if (
    !password ||
    password.length < minLength ||
    !specialCharacters.test(password)
  ) {
    return res
      .status(400)
      .json({
        error:
          "Password must be at least eight characters long and contain at least one special character",
      });
  }

  // Check if the email already exists in the database
  const existingUser = await UserModel.findOne({ email: email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash the password using bcrypt
  try {
    const hashPass = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new UserModel({
      email: email,
      password: hashPass,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    res
      .status(200)
      .json({ message: "User created successfully", data: savedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Export the router
module.exports = UserRegister;
