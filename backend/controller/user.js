
const asyncHandler = require('express-async-handler')


const userModel = require('../models/users')
const { Hashing } = require('../utils/hashingPass')
const { createToken } = require('../middlewares/authMiddleware');




const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select(['passwordHash', 'email'])
        res.json({success: true, users})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: "Something went wrong", error})
    }
}

const addUser = async (req, res) => {
    const userData = req.body;
    try {
        userData.passwordHash = await Hashing(userData.password)
        delete userData.password
        const newUser = new userModel(userData);
        await newUser.save();
        res.status(201).json({ success: true, message: "user added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}


const getUser = async (req, res) => {
    try {
        const user = req.body;

        const userData = await userModel.findOne({email:user.email});
        res.status(200).json({success : true, userData})
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

const changeUserRole = asyncHandler( async (req,res,next)=>{
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      accountType: req.body.role,
      phone: req.body.phone,
    },
    {new: true}
  )

  res.status(200).json({ data: updatedUser })

})


const getLoggedUserData = asyncHandler(async(req,res,next)=>{
  req.params.id = req.user._id
  next();
})

const updateLoggedUserPassword = asyncHandler(async(req,res,next)=>{
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await Hashing(password),
      passwordChangedAt: Date.now(),
    },
    {new: true}
  )


  // 2) generate token
  const token = createToken({ email: user.email });

  res.status(200).json({data: user, token})


})


module.exports = {
    getAllUsers, 
    addUser, 
    getUser,
    changeUserRole,
    getLoggedUserData,
    updateLoggedUserPassword
}