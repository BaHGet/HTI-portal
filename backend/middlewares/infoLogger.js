const logger = require("../utils/logger")


const infoLogger = (req, res, next) => {
  res.on('finish', () => {   
    if (res.statusCode < 400) {
      const userId = req.user?._id?.toString() || 'unknown';
      const endpoint = req.route?.path || req.originalUrl;
      logger.info(`The endpoint ${endpoint} was called from user with ID ${userId}`);
    }
  });

  next();
};

module.exports = infoLogger;

