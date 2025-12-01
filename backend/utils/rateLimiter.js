const rateLimit = require('express-rate-limit');


const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 300,
  message: { status: 'fail', message: 'Too many requests, please try again later.' },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});


const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  limit: 3,
  skipSuccessfulRequests: true, 
  message: { status: 'fail', message: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  }
});

module.exports = { globalLimiter, authLimiter };