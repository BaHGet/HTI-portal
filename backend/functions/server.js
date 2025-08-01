require('dotenv').config()
const express = require("express");
const serverless = require("serverless-http");
const morgan = require('morgan');
const logger = require('../utils/logger');
const cookieParser = require('cookie-parser');
const globalError = require('../middlewares/apiMiddleware')
const errorLogger = require('../middlewares/errorLogger')
const infoLogger = require('../middlewares/infoLogger') 


const app = express();
app.use(express.json());

// Use morgan middleware to log HTTP requests
// Custom token for req.params
morgan.token('params', (req) => JSON.stringify(req.params));

// Define custom morgan token to log body (with password redacted)
morgan.token('body', (req) => {
  const clone = { ...req.body };

  // Redact password fields
  for (const key in clone) {
    if (key.toLowerCase().includes('password')) {
      clone[key] = '[REDACTED]';
    }
  }

  return JSON.stringify(clone);
});

// Custom format string (you can remove or add fields as needed)
const customFormat = (tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    '- Params:', tokens.params(req, res),
    '- Body:', tokens.body(req, res)
  ].join(' ');
};
app.use(morgan(customFormat, {
  stream: {
    write: message => logger.info(message.trim())
  }
}));

app.use(cookieParser());
app.use(infoLogger);

const db = require("../config/db");
db.dbConnection();

const { authRouter } = require("../routes/auth");
app.use("/api/auth", authRouter);

const { userRouter } = require("../routes/user");
app.use("/api/user", userRouter);


app.all("/{*any}", (req,res,next)=>{
  next(new ApiError(`Can't find this URL: ${req.originalUrl}`,400))
})

app.get("/", (req, res) => {
  res.send("hi");
});

app.use(errorLogger);

// Global error handling middleware for express
app.use(globalError);

app.listen(3000);

// module.exports.handler = serverless(app);
