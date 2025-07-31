// utils/logger.js
const { createLogger, format, transports } = require('winston');
const moment = require('moment-timezone');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: () => moment().tz('Africa/Cairo').format('YYYY-MM-DD HH:mm:ss')
    }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

module.exports = logger;
