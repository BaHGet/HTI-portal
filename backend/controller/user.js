const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler')
const db = require('../models/index')
const ApiError = require('../utils/apiError');
const { Hashing } = require('../utils/hashingPass')
const { createToken } = require('../middlewares/authMiddleware');

const logger = require('../utils/logger');

const getAllUsers = async (req, res) => {
  logger.info(`the endpoint ${req.route.path} was called from user with id ${req.user.UserID}`)
  try {
      const users = await db.User.findAll({
        attributes: ['FullName', 'Email']
      });
      // check if the users exists
      if(!users){
        new Error('Intrnal Server Error')
      }
      res.json({success: true, users})

  } catch (error) {
      logger.error(`${err.status || 500} - ${err.message}`);
      res.status(500).json({success: false, message: "Something went wrong", error})
  }
}

const addUser = async (req, res) => {
    logger.info(`the endpoint ${req.route.path} was called from user with id ${req.user.UserID}`);
    const { email, password, fullName, nationalId, phoneNumber, accountType } = req.body;
    try {
        const hashedPassword = await Hashing(password);
        const newUser = await db.User.create({
          Email: email,
          PasswordHash: hashedPassword,   
          FullName: fullName,
          NationalID: nationalId,
          PhoneNumber: phoneNumber,
          AccountType: accountType
        });
        res.status(201).json({ success: true, message: "user added successfully" });
    } catch (error) {
        logger.error(`${error.status || 500} - ${error.message}`);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}


const getUser = async (req, res) => {
    logger.info(`the endpoint ${req.route.path} was called from user with id ${req.user.UserID}`);
    try {
        const user = req.body;

        const userData = await db.User.findOne({ where: { Email: user.email } });
        if (!userData) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
        // delete userData.passwordHash;
        res.status(200).json({success : true, userData})
    } catch (error) {
        logger.error(`${err.status || 500} - ${err.message}`);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

const changeUserRole = asyncHandler( async (req,res,next)=>{
  logger.info(`the endpoint ${req.route.path} was called from user with id ${req.user.UserID}`);

  const userToUpdate = await db.User.findOne({ where: { Email: req.body.email } }); 

  userToUpdate.AccountType = req.body.accountType;
  userToUpdate.PhoneNumber = req.body.phone; 

  const updatedUser = await userToUpdate.save();

  res.status(200).json({ data: updatedUser })

})


const getLoggedUserData = asyncHandler(async(req,res,next)=>{
  const userId = req.user.UserID;
  const accountType = req.user.AccountType;

  let profileData = null;

  if (accountType === 'student' || accountType === 'Graduated') {
    profileData = await db.Student.findOne({
      where: { UserID: userId },
      attributes: ['StudentID','StudentName','StudentAddress','CreditHours','gpa'], 
      include: [
        { 
          model: db.Department,
          attributes: ['DepartmentName'],
          include: [{
            model: db.College,
            attributes: ['CollegeName']
          }]
        },
        {
          model: db.AcademicRegulation,
          attributes: ['RegulationName','TotalRequiredCredits','RegulationDescription']
        }
      ],
      // raw: true,
      nest: true
    });
  }else if (accountType === 'professor') {
    profileData = await db.Professor.findOne({
      where: { UserID: userId },
      attributes: { exclude: ['UserID','DepartmentID'] },
      include: [
        { 
          model: db.Department,
          attributes: ['DepartmentName'],
          include: [{
            model: db.College,
            attributes: ['CollegeName']
          }]
        }
      ],
      raw: true,
      nest: true
    });
  }else if (accountType === 'admin') {
    profileData = await db.User.findByPk(userId, {
      attributes: { exclude: ['PasswordHash', 'PasswordChangedAt', 'PasswordResetCode', 'PasswordResetExpires', 'PasswordResetVerified'] },
      raw: true,
      nest: true
    });
  }
  
  if (!profileData) {
    return next(new ApiError('Profile data not found for this user.', 404));
  }

  res.status(200).json({
    status: 'success',
    role: accountType, 
    data: profileData
  });

})


const updateLoggedUserPassword = asyncHandler(async(req,res,next)=>{
  logger.info(`the endpoint ${req.route.path} was called from user with id ${req.user.UserID}`);


  // 1) Get user from database
  const user = await db.User.findByPk(req.user.UserID,
    {
    attributes: ['UserID', 'Email', 'PasswordHash']
    }
  );
  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  // 2) Check Current Password is correct
  const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.PasswordHash); 
  if (!isCorrectPassword) {
    return next(new ApiError('Current password is incorrect', 401));
  }

  // 3) Hash the new password and update it
  user.PasswordHash = await Hashing(req.body.newPassword);
  user.PasswordChangedAt = Date.now();
  await user.save()

  // 4) generate token and send response
  const token = createToken({ id: user.UserID, email: user.Email });
  res.header('token',token);
  res.status(200).json({data: user})
})

const logout = asyncHandler(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now()), 
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.'
  });
});

module.exports = {
  getAllUsers, 
  addUser, 
  getUser,
  changeUserRole,
  getLoggedUserData,
  updateLoggedUserPassword,
  logout
}