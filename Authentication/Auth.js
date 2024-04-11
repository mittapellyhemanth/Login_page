const jwt = require("jsonwebtoken");
const config = require("../Config/Config");

const auth = (req, res, next) => {
  console.log("reached auth");
  try {
    const token = req.headers.authorization; // It will look for token in headers
    console.log(token);
    const verify = jwt.verify(token, config.SECRET_TOKEN_KEY); // verify token
    req.id = verify.id; // store user ref id
    console.log("authentication sucess");
    next();
  } catch {
    res.status(400).json({
      message: "Authentication failed",
    }); // error
    console.log("authentication failed");
  }
};

module.exports = auth;
