require('dotenv').config()
const express = require("express");

const serverless = require("serverless-http");

const app = express();
app.use(express.json());

const db = require("../config/db");
db.dbConnection();

const { authRouter } = require("../routes/auth");
app.use("/api/login", authRouter);

const { userRouter } = require("../routes/user");
app.use("/api/user", userRouter);


app.get("/", (req, res) => {
  res.send("hi");
});

app.listen(3000);

// module.exports.handler = serverless(app);
