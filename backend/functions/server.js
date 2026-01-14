// Core
require("dotenv").config();
const express = require("express");
const http = require('http');
const { initSocket } = require("../utils/socket");
// Security & utils
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
// App utils
// const serverless = require("serverless-http");
const logger = require("../utils/logger");
const globalError = require("../middlewares/apiMiddleware");
const ApiError = require("../utils/apiError");
const socketIo = require("socket.io");
const app = express();


// ✅ CORS (لازم Origin محدد طالما withCredentials = true)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const corsOptions = {
  origin: CLIENT_ORIGIN, // ❌ ممنوع "*"
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "reset-token"],
  exposedHeaders: ["token", "reset-token"],
};

app.use(cors(corsOptions));
// ✅ رد سريع للـ preflight قبل أي middleware/limiter
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: "5kb" }));
app.use(helmet());
app.use(hpp());

// Custom XSS middleware
app.use((req, res, next) => {
  const clean = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key].replace(/</g, "&lt;").replace(/>/g, "&gt;");
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        clean(obj[key]);
      }
    }
  };
  if (req.body) clean(req.body);
  if (req.query) clean(req.query);
  if (req.params) clean(req.params);

  next();
});

// Use morgan middleware to log HTTP requests
morgan.token("params", (req) => JSON.stringify(req.params));

morgan.token("body", (req) => {
  const clone = { ...req.body };
  for (const key in clone) {
    if (key.toLowerCase().includes("password")) {
      clone[key] = "[REDACTED]";
    }
  }
  return JSON.stringify(clone);
});

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


const { globalLimiter } = require("../utils/rateLimiter");
// ✅ حط ال limiter بعد CORS + OPTIONS عشان ما يكسرش الـ preflight
app.use("/api/v1/", globalLimiter);

// Routes
const { authRouter } = require("../routes/auth");
app.use("/api/v1/auth", authRouter);

const { registerSubRouter } = require("../routes/registerSubRouter");
app.use("/api/v1/registration", registerSubRouter);

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

const { professorsRouter } = require("../routes/professorRoute");
app.use("/api/v1/professors", professorsRouter);

// 404 handler (لازم قبل globalError)
app.all(/.*/, (req, res, next) => {
  next(new ApiError(`Can't find this URL: ${req.originalUrl}`, 404));
});

// Global error handling middleware (آخر حاجة)
app.use(globalError);

// Server + Socket.io
const server = http.createServer(app);

initSocket(server);

server.listen(3000, () => {
  console.log(`Server running on port 3000`);
  console.log(`Socket.io is ready! 🚀`);
});

// لو هتستخدم serverless:
// module.exports.handler = serverless(app);
