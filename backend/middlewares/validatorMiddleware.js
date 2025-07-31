const { validationResult } = require('express-validator');

// 2- middleware ==> catch errors from rules if exist before going to server
const validatorMiddleware =  (req, res , next) => {
  // @desc find validation error in request 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  } 
  next();
}

module.exports = validatorMiddleware;