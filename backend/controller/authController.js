
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const { comparing } = require('../utils/hashingPass');
const { createToken } = require('../middlewares/authMiddleware');

const login = async (req, res) => {
  // data to validate user with
  const user = req.body
  try {
    const checkUser = await User.findOne({ email: user.email /* maybe the user id or whatever */ });
    if (!checkUser) return res.status(400).send('Invalid User');

    const validPass = await comparing(user.password, checkUser.passwordHash);
    if (!validPass) return res.status(400).send('Invalid Password');

    const token = createToken({ email: user.email })
    res.header('token', token);
    res.status(200).send()
  } catch (err) {
    res.status(500).json({ error: "Internal server error", message: err.message });
  }
};

module.exports = { login }