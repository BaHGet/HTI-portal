import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_API_URL;

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/login`, {
      email,
      password,
    });

    if (response.headers.Token) {
      localStorage.setItem("Api_token", response.headers.Token);
    } else if (response.headers.token) {
      localStorage.setItem("Api_token", response.headers.token);
    } else if (response.headers.authorization) {
      localStorage.setItem("Api_token", response.headers.authorization);
    } else {
      console.warn("No token found in response headers");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendOtp = async (email) => {
  try {
    const res = await axios.post(`${baseUrl}/auth/forgotpassword`, { email });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (resetCode) => {
  try {
    const res = await axios.post(`${baseUrl}/auth/verifyresetcode`, {
      resetCode,
    });
    console.log(res.headers);
    if (res.headers[`reset-token`]) {
      localStorage.setItem("Api_Reset_token", res.headers[`reset-token`]);
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (NewPassword) => {
  try {
    const res = await axios.put(
      `${baseUrl}/auth/resetpassword`,
      {
        NewPassword,
        ConfirmPassword: NewPassword,
      },
      { headers: { "reset-token": localStorage.getItem("Api_Reset_token") || "" } }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
