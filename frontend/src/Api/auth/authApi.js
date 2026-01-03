import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_API_URL;

// Create a dedicated axios instance (recommended)
const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // send cookies cross-origin
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: normalize backend errors
const throwNiceError = (error) => {
  // Backend sent a response
  if (error.response) {
    const msg =
      error.response.data?.message ||
      error.response.data?.error ||
      `Request failed with status ${error.response.status}`;
    const e = new Error(msg);
    e.status = error.response.status;
    e.data = error.response.data;
    throw e;
  }

  // No response (CORS / network / server down)
  if (error.request) {
    const e = new Error("Network/CORS error: backend not reachable or blocked");
    e.status = 0;
    throw e;
  }

  // Something else
  throw error;
};

/**
 * LOGIN
 * Backend sets httpOnly cookie (auth_token)
 */
export const login = async (email, password) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  } catch (error) {
    throwNiceError(error);
  }
};

/**
 * LOGOUT
 * Backend clears auth cookie
 */
export const logout = async () => {
  try {
    const { data } = await api.post("/user/logout");
    return data;
  } catch (error) {
    throwNiceError(error);
  }
};

/**
 * SEND OTP (Forgot password)
 */
export const sendOtp = async (email) => {
  try {
    const { data } = await api.post("/auth/forgotpassword", { email });
    return data;
  } catch (error) {
    throwNiceError(error);
  }
};

/**
 * VERIFY OTP
 * Backend stores reset token in cookie
 */
export const verifyOtp = async (resetCode) => {
  try {
    const { data } = await api.post("/auth/verifyresetcode", { resetCode });
    return data;
  } catch (error) {
    throwNiceError(error);
  }
};

/**
 * RESET PASSWORD
 * Cookie (reset_token) is sent automatically
 */
export const resetPassword = async (newPassword) => {
  try {
    const { data } = await api.put("/auth/resetpassword", {
      NewPassword: newPassword,
      ConfirmPassword: newPassword,
    });
    return data;
  } catch (error) {
    throwNiceError(error);
  }
};
