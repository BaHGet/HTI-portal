import React, { useState, useRef, useEffect } from "react";
import HtiLogo from "./../assets/1.jpg"; // Ensure this path is correct
import MailIcon from "./../assets/Icons/mail.svg"; // Ensure this path is correct
import LockClosedIcon from "./../assets/Icons/padlock.svg"; // Assuming you have this icon
import EyeIcon from "./../assets/Icons/hide.svg"; // Path to your eye-open icon
import EyeOffIcon from "./../assets/Icons/show.svg"; // Path to your eye-closed icon
import { Link } from "react-router-dom";
import { sendOtp, verifyOtp, resetPassword } from "../Api/auth/authApi";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]); // State for 6 individual OTP digits
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [sys_msg, setSysMsg] = useState("Coded by HTI Students");
  const [showPassword, setShowPassword] = useState(false);
  const [correctOtp, setCorrectOtp] = useState(false); // State to control password field visibility

  // 'email_input': User enters email
  // 'otp_sent': OTP has been sent, user enters OTP in 6 separate fields
  // 'password_reset': OTP is correct, user enters new password
  // 'reset_success': Password has been successfully reset, show success UI
  const [step, setStep] = useState("email_input");

  // Refs for OTP input fields to manage focus
  const otpInputRefs = useRef([]);

  // Style for icons loaded via img tag
  const iconStyle = {
    color: "#9ca3af",
    filter:
      "invert(62%) sepia(6%) saturate(0%) hue-rotate(180deg) brightness(93%) contrast(89%)",
  };

  // Function to handle OTP digit input and focus management
  const handleOtpChange = (index, value) => {
    // Only allow single digit and numerical input
    const newDigit = value.replace(/[^0-9]/g, "").slice(0, 1);
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = newDigit;
    setOtpDigits(newOtpDigits);

    // Auto-focus to the next input if a digit was entered
    if (newDigit && index < otpDigits.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Function to handle backspace and navigation for OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && otpDigits[index] === "" && index > 0) {
      // If backspace on an empty field, move focus to previous field
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < otpDigits.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSysMsg(""); // Clear previous messages

    if (step === "email_input") {
      // Stage 1: Send OTP
      sendOtp(email);
      console.log("Requesting OTP for Email:", email);
      setSysMsg("OTP sent to your email. Please check your inbox.");
      setStep("otp_sent"); // Transition to OTP entry stage
    } else if (step === "otp_sent") {
      // Stage 2: Verify OTP
      const enteredOtp = otpDigits.join(""); // Combine digits to form full OTP
      console.log("Verifying OTP:", enteredOtp);

      if (enteredOtp.length !== 6) {
        setSysMsg("Error: OTP must be 6 digits.");
        return;
      }

      const isOtpValid = verifyOtp(email, enteredOtp); // Placeholder for OTP validation
      if (isOtpValid) {
        setSysMsg("OTP verified. Please set your new password.");
        setCorrectOtp(true); // Set correctOtp to true
        setStep("password_reset"); // Transition to new password entry stage
      } else {
        setSysMsg("Error: Invalid OTP. Please try again.");
        setOtpDigits(["", "", "", "", "", ""]); // Clear OTP fields on error
        otpInputRefs.current[0]?.focus(); // Focus back to the first OTP input
      }
    } else if (step === "password_reset") {
      // Stage 3: Reset Password
      console.log("Setting New Password:", newPassword);
      console.log("Confirm New Password:", confirmNewPassword);

      if (newPassword !== confirmNewPassword) {
        setSysMsg("Error: Passwords do not match.");
        return;
      }else if (newPassword.length < 6) {
        // Basic password length validation
        setSysMsg("Error: New password must be at least 6 characters long.");
        return;
      }

      resetPassword(email, newPassword, otpDigits.join(""));

      setSysMsg("Password has been successfully reset!");
      // After successful reset, transition to success UI
      setStep("reset_success");
      // Clear form fields, but keep them for potential re-use if user goes back
      setEmail("");
      setOtpDigits(["", "", "", "", "", ""]);
      setNewPassword("");
      setConfirmNewPassword("");
      setCorrectOtp(false); // Reset correctOtp
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Function to handle "Back to Login" from success screen
  const handleBackToLogin = () => {
    
  };

  // Effect to focus on the first OTP input when the step changes to otp_sent
  useEffect(() => {
    if (step === "otp_sent" && otpInputRefs.current[0]) {
      otpInputRefs.current[0].focus();
    }
  }, [step]);

  return (
    <div className="flex bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full mx-4 sm:mx-0">
      {/* Left Column - Illustration/Promotional (Same as Login Page) */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden rounded-r-lg">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={HtiLogo}
            alt="HTI Logo"
            className="w-2/3 h-2/3 object-contain"
          />
        </div>
      </div>

      {/* Right Column - Forgot Password Form / Success Message */}
      <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col bg-gray-10 justify-center">
        <div className="flex items-center text-gray-800 text-lg font-semibold mb-6">
          <span>HTI Edu Portal</span> {/* Keep branding consistent */}
        </div>

        {step !== "reset_success" && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Forgot Your Password?
            </h2>
            <p className="text-gray-600 mb-6">
              {step === "email_input"
                ? "Enter your email address below and we'll send you a One-Time Password (OTP)."
                : step === "otp_sent"
                ? "Enter the 6-digit OTP sent to your email to verify."
                : "OTP verified. Please set your new password."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input - Stage 1 */}
              {step === "email_input" && (
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <img
                        src={MailIcon}
                        alt="Mail Icon"
                        className="w-5 h-5"
                        style={iconStyle}
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 sm:text-sm"
                      placeholder="Enter your Edu Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* OTP Input Fields - Stage 2 */}
              {step === "otp_sent" && (
                <div>
                  <label htmlFor="otp-inputs" className="sr-only">
                    OTP
                  </label>
                  <div
                    id="otp-inputs"
                    className="flex justify-between space-x-2"
                  >
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        className="w-10 h-10 text-center text-lg font-bold border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* New Password & Confirm Password Inputs - Stage 3 */}
              {correctOtp &&
                step === "password_reset" && ( // Only show if correctOtp is true AND step is password_reset
                  <>
                    <div>
                      <label htmlFor="new-password" className="sr-only">
                        New Password
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <img
                            src={LockClosedIcon}
                            alt="Lock Icon"
                            className="w-5 h-5"
                            style={iconStyle}
                          />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="new-password"
                          id="new-password"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 sm:text-sm"
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        {/* Show/Hide Password Link */}
                        <a
                          href="#"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          title={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          <img
                            src={showPassword ? EyeOffIcon : EyeIcon}
                            alt={
                              showPassword ? "Hide password" : "Show password"
                            }
                            className="w-5 h-5"
                            style={iconStyle}
                          />
                        </a>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirm-new-password" className="sr-only">
                        Confirm New Password
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <img
                            src={LockClosedIcon}
                            alt="Lock Icon"
                            className="w-5 h-5"
                            style={iconStyle}
                          />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirm-new-password"
                          id="confirm-new-password"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 sm:text-sm"
                          placeholder="Confirm New Password"
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                          required
                        />
                        {/* Show/Hide Password Link */}
                        <a
                          href="#"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          title={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          <img
                            src={showPassword ? EyeOffIcon : EyeIcon}
                            alt={
                              showPassword ? "Hide password" : "Show password"
                            }
                            className="w-5 h-5"
                            style={iconStyle}
                          />
                        </a>
                      </div>
                    </div>
                  </>
                )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {step === "email_input"
                  ? "Send OTP"
                  : step === "otp_sent"
                  ? "Verify OTP"
                  : "Reset Password"}
              </button>
            </form>

            {/* Back to Login Link (visible before success screen) */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Remember your password?{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
                onClick={handleBackToLogin}
              >
                <Link to="/auth/new-login">Back to Login</Link>
              </a>
            </p>
          </>
        )}

        {/* Password Reset Success UI */}
        {step === "reset_success" && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              Password Has Been Reset!
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Your password has been successfully updated. You can now log in
              with your new password.
            </p>
            <div className="mt-6">
              <Link to="/auth/new-login">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Login
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* System Message (always visible) */}
        <div className="relative flex py-5 items-center">
          <span className="flex-shrink mx-4 text-gray-500 text-sm">
            {sys_msg}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
