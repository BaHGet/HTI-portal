const router =require ('express').Router();
const userModel = require ('../models/users')
const loginValidtion = require('../validation/loginValidation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

router.post('/login', async(req,res)=>{
  // check if there is an error in the id or pass
  const {error} = loginValidtion(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }  

  // checking if the id and password are right
  const user = await userModel.findOne({_id: req.body.id})
  if (!user ) return res.status(400).send('check your ID or Password')
  const validPass = await bcrypt.compare(req.body.password, user.passwordHash)
  if (!validPass ) return res.status(400).send('check your ID or Password') 

  // Hashing password
  const salt = await bcrypt.genSalt(10)
  const hashedpassword = await bcrypt.hash(req.body.password, salt)

  // Create token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
  res.header('auth-token',token).send(token)
})


module.exports = router ;