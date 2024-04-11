const express = require("express");
const UserLogin = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../Config/Config");
const UserModel = require("../Schema_mongodb/User_Schema");

UserLogin.post("/login", async (req, res) => {
  const loginCred = req.body;
  console.log(req.body);
  try {
    const user = await UserModel.findOne({ email: loginCred.email });
    if (user) {
      // Check if user exists
      bcrypt.compare(loginCred.password, user.password, (err, result) => {
        if (err) {
          // Handle bcrypt compare error
          throw err;
        }
        if (result) {
          // If password matches
          const jwtToken = jwt.sign(
            {
              email: user.email,
              id: user._id,
            },
            config.SECRET_TOKEN_KEY,
            {
              expiresIn: "24h",
            }
          );
          res.status(200).json({
            message: "Login credential matched!!",
            Token: jwtToken,
            user: user,
          });
        } else {
          // If password does not match
          res.status(400).json({
            message: "Email or password does not match!!",
          });
        }
      });
    } else {
      // If user does not exist
      res.status(401).json({
        message: "Email is not registered with us..",
      });
    }
  } catch (error) {
    // Catch any unexpected errors
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = UserLogin;
