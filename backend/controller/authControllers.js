const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    if (!user) return res.status(400).send('Invalid ID');

    const validPass = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!validPass) return res.status(400).send('Invalid Password');

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({ token });

  } catch (err) {
    res.status(500).send('Server Error');
  }
};
