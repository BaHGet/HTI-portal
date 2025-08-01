const ApiError = require('../utils/apiError')
const logger = require('../utils/logger');

const sendError = (err,res)=> res.status(err.statusCode).json({
  status: err.status,
  error: err,
  message: err.message,
  stack: err.stack
})

const handleJwtInvalidSignature = () => new ApiError("invalid token, please login again...", 401)
const handleJwtExpired = () => new ApiError("token expired, please login again...", 401)

const globalError = (err, req, res, next) => {
  
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);


  if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
  if (err.name === "TokenExpiredError") err = handleJwtExpired();

  sendError(err, res);
};

module.exports = globalError;
