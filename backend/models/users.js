const mongoose = require("mongoose");

/**
 * Mongoose schema definition for the User model.
 *
 * This schema represents users within the HTI portal system, including students, staff, admins, and graduates.
 * It captures essential user information, authentication details, account status, academic and payment data,
 * as well as security-related fields.
 *
 * Schema Fields:
 * - _id: Unique student ID (Number, required)
 * - email: User's email address (String, required, unique)
 * - passwordHash: Hashed password for authentication (String, required)
 * - fullName: Full name of the user (String, required)
 * - nationalId: National identification number (String, 14 characters, unique)
 * - phoneNumber: User's phone number (String, 11 characters)
 * - gender: Gender of the user (String, enum: 'male', 'female')
 * - birthDate: Date of birth (Date)
 * - profileImageUrl: URL to the user's profile image (String)
 * - accountType: Role of the user in the system (String, enum: 'student', 'staff', 'admin', 'Graduated', default: 'student')
 * - academic: Academic information (Object)
 *    - program: Academic program (String)
 *    - department: Department name (String)
 *    - enrollmentYear: Year of enrollment (Number)
 * - payment: Payment information (Object)
 *    - hasPaid: Indicates if the user has paid (Boolean)
 *    - status: Payment status (String, enum: 'full', 'partial', 'unpaid', default: 'unpaid')
 *    - lastPaymentDate: Date of last payment (Date)
 * - security: Security and activity information (Object)
 *    - twoFactorEnabled: Two-factor authentication enabled (Boolean)
 *    - isActive: Account is active (Boolean, default: true)
 *    - isBlocked: Account is blocked (Boolean, default: false)
 *    - lastLogin: Last login date (Date)
 * - createdAt: Account creation date (Date, default: now)
 *
 * The schema also includes automatic timestamping for creation and update times.
 */
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: [true, "Student ID is required"],
    }, // Student ID
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    nationalId: {
      type: String,
      length: 14,
      unique: true,
    },
    phoneNumber: {
      type: String,
      length: 11,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    birthDate: Date,
    profileImageUrl: String,
    accountType: {
      type: String,
      enum: ["student", "staff", "admin", "Graduated"],
      default: "student",
    },
    academic: {
      program: String,
      department: String,
      enrollmentYear: Number,
    },
    payment: {
      hasPaid: Boolean,
      status: {
        type: String,
        enum: ["full", "partial", "unpaid"],
        default: "unpaid",
      },
      lastPaymentDate: Date,
    },
    security: {
      twoFactorEnabled: Boolean,
      isActive: { type: Boolean, default: true },
      isBlocked: { type: Boolean, default: false },
      lastLogin: Date,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
