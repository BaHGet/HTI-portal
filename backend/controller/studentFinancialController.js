const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const db = require("../models/index");


exports.getStudentFinantial = asyncHandler(async(req,res,next)=>{
  const studentId = req.student.StudentID;
  const academicYear = req.currentAcademicYear;

  const financeRecord = await db.StudentFinancial.findOne({
    where: { StudentID: studentId, AcademicYear: academicYear },
  });
  if (!financeRecord) {
    return next(new ApiError('No financial record found for this student.', 404));
  }

  const basic = Number(financeRecord.BasicFees);
  const additional = Number(financeRecord.AdditionalFees);
  const card = Number(financeRecord.CardFees);
  const retake = Number(financeRecord.RetakeFees);
  const appeal = Number(financeRecord.AppealFees);
  
  const totalPaid = Number(financeRecord.TotalPaid);
  const dbFirstInstTarget = Number(financeRecord.FirstInstallmentAmount);


  const totalRequired = basic + additional + card + retake + appeal;
  let firstInstallmentTarget = dbFirstInstTarget;
  if (firstInstallmentTarget === 0 && totalRequired > 0) {
    firstInstallmentTarget = totalRequired / 2;
  }

  const remainingTotal = Math.max(0, totalRequired - totalPaid);
  const remainingFirstInst = Math.max(0, firstInstallmentTarget - totalPaid);

  
  const isFirstInstDone = totalPaid >= firstInstallmentTarget;
  const isFullPaid = totalPaid >= totalRequired;

 
  res.status(200).json({
    status: 'success',
    data: {
      academicYear: financeRecord.AcademicYear,
      
      breakdown: {
        basicFees: basic,
        additionalFees: additional,
        cardFees: card,
        retakeFees: retake,
        appealFees: appeal
      },

      summary: {
        totalRequired: totalRequired,           
        firstInstallmentTarget: firstInstallmentTarget, 
        totalPaid: totalPaid,                  
        remainingTotal: remainingTotal,           
        remainingFirstInstallment: remainingFirstInst 
      },

      status: {
        isFirstInstallmentDone: isFirstInstDone,
        isFullPaid: isFullPaid
      }
    }
  });
  
})


