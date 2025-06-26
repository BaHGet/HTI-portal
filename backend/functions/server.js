const express = require("express");

const serverless = require("serverless-http");

const app = express();
app.use(express.json());

const dotenv = require("dotenv");
dotenv.config();

const db = require('../config/db')
const dbconnecet = db.dbConnection();


// Import Routes
const authRoute = require("../routes/auth");
// Route Middlewares
app.use("/user", authRoute);

const {userRouter} = require('../routes/user')
app.use('/api/user', userRouter)

app.listen(3000, () => {
  console.log("server is running");
});

// module.exports.handler = serverless(app);
