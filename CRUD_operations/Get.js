const express = require("express");
const UserLogin = express.Router();
const UserModel = require("../Schema_mongodb/User_Schema");
const bcrypt = require("bcrypt");
const auth = require("../Authentication/Auth");
// Route handler for user login
UserLogin.get("/sucessfully", auth, async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email: email });

  // Check if the user exists
  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  // Compare the provided password with the hashed password
  const passwordMatch = await bcrypt.compare(password, user.password);

  // If passwords match, user is authenticated
  if (passwordMatch) {
    return res.status(200).json({ message: "Login successful", email });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
});

// Export the router
module.exports = UserLogin;
