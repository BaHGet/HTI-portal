
const asyncHandler = require('express-async-handler');


exports.setCurrentAcademicYear = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); 

  let academicYear;
  if (currentMonth >= 8) { 
    academicYear = `${currentYear}/${currentYear + 1}`;
  } else {
    academicYear = `${currentYear - 1}/${currentYear}`;
  }
  req.currentAcademicYear = academicYear;
  
  next();
});







