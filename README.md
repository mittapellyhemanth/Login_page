# Login_page
The provided code consists of several files and functionalities that work together to create a simple user registration and login system using Express.js and MongoDB. Let's break down each part:

1. app.js:

=> This is the main file where the Express application is configured and the server is started.
=> It imports required modules such as Express, body-parser, and the connectDB function for establishing a connection to the MongoDB database.
   Middleware is set up to parse JSON bodies (express.json()) and URL-encoded bodies (bodyParser.urlencoded()).
=> Static file serving is enabled for the 'public' directory using express.static().
=> The server is started and listens on the specified port (default is 3000).
   Two routes are mounted using app.use():
=> Login router for handling login-related operations.
=> Register router for handling user registration-related operations.

2. Post.js (Register router):

=> This file defines routes and handlers for user registration.
=> It imports Express and the UserModel schema from the MongoDB database.
=> The route handler for /register validates the email and password provided in the request body.
=> If the validation passes, it checks if the email already exists in the database.
=> If not, it hashes the password using bcrypt, creates a new user instance, saves it to the database, and sends a success response.
=> If there are any errors during the process, appropriate error responses are sent.

3. Get.js (Login router):

=> This file defines routes and handlers for user login.
=> It imports Express, UserModel, and bcrypt.
=> The route handler for /login attempts to find the user by email in the database.
=> If the user exists, it compares the provided password with the hashed password stored in the database.
=> If the passwords match, a success response is sent with a message indicating successful login. Otherwise, an error response is sent.

4. UserModel.js:

=> This file defines the Mongoose schema for the user model, specifying fields for email and password.

5. DB_connection.js:

=> This file contains the function for connecting to the MongoDB database using Mongoose.
=> It reads the database URL from the environment variables using dotenv and attempts to connect to the database.
=> If the connection is successful, a message is logged; otherwise, an error message is logged.

Overall, this code sets up a basic Express server with routes for user registration and login, connects to a MongoDB database, and provides functionality for creating and authenticating users.






