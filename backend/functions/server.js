require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const morgan = require("morgan");
const logger = require("../utils/logger");
const cookieParser = require("cookie-parser");
const globalError = require("../middlewares/apiMiddleware");
const ApiError = require("../utils/apiError");
const http = require('http'); 
const socketIo = require('socket.io');

const app = express();
const cors = require("cors");

app.use(express.json({limit:'5kb'}));
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "reset-token"],
    exposedHeaders: ["token", "reset-token"],
  })
);

// Use morgan middleware to log HTTP requests
// Custom token for req.params
morgan.token("params", (req) => JSON.stringify(req.params));

// Define custom morgan token to log body (with password redacted)
morgan.token("body", (req) => {
  const clone = { ...req.body };

  // Redact password fields
  for (const key in clone) {
    if (key.toLowerCase().includes("password")) {
      clone[key] = "[REDACTED]";
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
    "- Params:",
    tokens.params(req, res),
    "- Body:",
    tokens.body(req, res),
  ].join(" ");
};
app.use(
  morgan(customFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(cookieParser());

const sql = require("../config/mysqlDB");
sql.dbConnection();

const { globalLimiter } = require ("../utils/rateLimiter")
app.use("/api/v1/", globalLimiter);

const { authRouter } = require("../routes/auth");
app.use("/api/v1/auth", authRouter);

const { registerSubRouter } = require("../routes/registerSubRouter");
app.use("/api/v1/registration",registerSubRouter);

const { userRouter } = require("../routes/user");
app.use("/api/v1/user", userRouter);

const { withdrawalSubRouter } = require("../routes/withdrawalRoute");
app.use("/api/v1/withdrawal", withdrawalSubRouter);

const { GradeAppealRouter } = require("../routes/gradeAppealRoute");
app.use("/api/v1/appeals", GradeAppealRouter);

const { SchedulesRouter } = require("../routes/examScheduleRoute");
app.use("/api/v1/schedules", SchedulesRouter);

const { ResultsRouter } = require("../routes/resultsRoute");
app.use("/api/v1/results", ResultsRouter);

const { EvaluationRouter } = require("../routes/evaluationRoute");
app.use("/api/v1/evaluations", EvaluationRouter);

const { PaymentRouter } = require("../routes/studentFinancialRoute");
app.use("/api/v1/payment", PaymentRouter);


app.all("/{*any}", (req, res, next) => {
  next(new ApiError(`Can't find this URL: ${req.originalUrl}`, 400));
});

app.get("/", (req, res) => {
  res.send("hi");
});

// Global error handling middleware for express
app.use(globalError);

// Server Connection
const server = http.createServer(app); 
const io = socketIo(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});
app.use((req, res, next) => {
  req.io = io;
  next();
});

server.listen(3000, () => {
  console.log(`Server running on port 3000`);
  console.log(`Socket.io is ready! 🚀`);
});
// module.exports.handler = serverless(app);
