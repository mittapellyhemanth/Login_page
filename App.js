const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./DB_connect/DB_connection"); // Import connectDB function
const UserModel = require('./Schema_mongodb/User_Schema')
const config = require("./Config/Config");
// Middleware setup
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const cors = require('cors');
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Connect to MongoDB
connectDB(); // Call the connectDB function to establish the connection






const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

// Create a transporter using SMTP
let transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider
    auth: {
        user: 'mittapellyhemanth1998@gmail.com', // we have to mention email address of office
        pass: 'edwcrjuovylsgqcc' //email  password
    }
});

// Object to store verification codes and their timestamps
const verificationCodes = {};

// Function to send verification email
function sendVerificationEmail(email, verificationCode) {
    // Email content
    let mailOptions = {
        from: 'mittapellyhemanth1998@gmail.com', // we have to mention email address of office
        to: email,
        subject: 'Email Verification',
        html: `<p>Your verification code is: ${verificationCode} it expires in 5 minutes. </p>`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email: ", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });
}

// Endpoint to handle verification request
app.post('/verify-email', async (req, res) => {
  
    const { email } = req.body;
    console.log(email);
    const user = await UserModel.findOne({ email:email });
    if (!user) {
        return res.status(404).json({ email_error: 'User does not exists ' });
    }

    // Generate a random verification code
    const verificationCode = randomstring.generate({
        length: 6,
        charset: 'numeric'
    });

    // Store verification code and its timestamp
    verificationCodes[email] = {
        code: verificationCode,
        timestamp: Date.now()
    };

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
    // Send verification email
    sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: 'Verification email sent successfully',Token:jwtToken });
 
    
});

// Endpoint to verify the code
app.post('/verify-code', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and code are required' });
    }
    
    const storedCode = verificationCodes[email];
    console.log(storedCode);
    if (!storedCode) {
      console.log(email,otp);
        return res.status(400).json({ error: 'Unable to login try again' });
    }

    // Check if the verification code is expired
    const currentTime = Date.now();
    const codeExpirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    if (currentTime - storedCode.timestamp > codeExpirationTime) {
        return res.status(400).json({ error: 'Verification code has expired' });
    }
// console.log(storedCode.otp);
    if (storedCode.code === otp) {
        // Verification successful, delete the verification code
        delete verificationCodes[email];
        console.log("Verification successful");
        res.json({ message: 'Verification successful' });
    } else {
        res.status(400).json({ error: 'Invalid verification code' });
    }
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
