const logger = require("../utils/logger")


const errorLogger = (err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method}`);
  next(err); 
};


module.exports = errorLogger;
