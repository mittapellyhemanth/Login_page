// app.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./DB_connect/DB_connection'); // Import connectDB function
// const User = require('./userModel');
require('dotenv').config();
// Middleware setup
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
connectDB(); // Call the connectDB function to establish the connection

const PORT = process.env.PORT || 3000;

const Register = require('./CRUD_operations/Post')
const Login = require('./CRUD_operations/Get');
app.use('/',Login)
app.use('/user',Register)
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
