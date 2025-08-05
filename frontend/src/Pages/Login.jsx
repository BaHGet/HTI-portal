import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HtiLogo from "./../assets/1.jpg";
import MailIcon from "./../assets/Icons/mail.svg";
import LockClosedIcon from "./../assets/Icons/padlock.svg";
import EyeIcon from "./../assets/Icons/hide.svg";
import EyeOffIcon from "./../assets/Icons/show.svg";
import "./../index.css";
import { login } from "../Api/auth/authApi";

const NewLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [sys_msg, setErrorMessage] = useState("Coded by HTI Students");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.log(error);
      setErrorMessage("Invalid email or password, please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full mx-4 sm:mx-0">
      {/* Left Column - Illustration/Promotional */}
      <div className="hidden lg:block w-1/2  relative overflow-hidden rounded-r-lg">
        {/* Placeholder for the illustration - you'd replace this with an actual SVG or image */}
        <div className=" justify-center">
          <div className="flex-shrink items-center text-gray-800 text-2xl text-center mt-10 font-semibold mb-6">
            <span>HTI EDU Portal</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={HtiLogo}
              alt="Login Illustration"
              className="w-4/7 h-4/7 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col bg-gray-10 justify-center">
        <h2 className="text-2xl text-gray-900 mb-2">
          Log in to your Account
        </h2>
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">
            continue with your EDU Email
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
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
                  style={{
                    color: "#9ca3af",
                    filter:
                      "invert(62%) sepia(6%) saturate(0%) hue-rotate(180deg) brightness(93%) contrast(89%)",
                  }}
                />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 sm:text-sm"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img
                  src={LockClosedIcon} // This will be your lock icon image
                  alt="Lock Icon"
                  className="w-5 h-5"
                  style={{
                    color: "#9ca3af",
                    filter:
                      "invert(62%) sepia(6%) saturate(0%) hue-rotate(180deg) brightness(93%) contrast(89%)",
                  }}
                />
              </div>
              <input
                type={showPassword ? "text" : "password"} // Dynamically set type
                name="password"
                id="password"
                autoComplete="off"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 sm:text-sm" // Increased pr-10 for button
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Show/Hide Password Button using img tags */}
              <span
                type="button" // Important: Prevent form submission
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                <img
                  src={showPassword ? EyeOffIcon : EyeIcon} // Choose icon based on state
                  alt={showPassword ? "Hide password" : "Show password"}
                  className="w-5 h-5"
                  style={{
                    color: "#9ca3af",
                    filter:
                      "invert(62%) sepia(6%) saturate(0%) hue-rotate(180deg) brightness(93%) contrast(89%)",
                  }}
                />
              </span>
            </div>
          </div>
          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <span
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500 text-sm"
            >
              <Link to="/forgot-password">Forgot your password?</Link>
            </span>
          </div>
          {/* Login Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <div className="relative flex py-5 items-center justify-center">
          <span className="flex-shrink mx-4 text-sm text-center ">
            {sys_msg !== "Coded by HTI Students" ? (
              <span className="text-red-600">{sys_msg}</span>
            ) : (
              <span className="text-gray-500">{sys_msg}</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewLogin;
