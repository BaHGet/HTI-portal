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

export const logout = () => {
  const token = localStorage.getItem("Api_token");
  
  if (token) {
    localStorage.removeItem("Api_token");
  }
};

export const sendOtp = async (email) => {
  let res = null;
  try {
    res = await axios.post(`${baseUrl}/auth/forgotpassword`, { email });
    console.log(res);
  } catch (error) {
    throw error;
  } finally {
    if (res === null) {
      res = { status: 404 };
    }
    return res;
  }
};

export const verifyOtp = async (resetCode) => {
  let res = null;
  try {
    res = await axios.post(`${baseUrl}/auth/verifyresetcode`, {
      resetCode,
    });
    console.log(res.headers);
    if (res.headers[`reset-token`]) {
      localStorage.setItem("Api_Reset_token", res.headers[`reset-token`]);
    }
  } catch (error) {
    throw error;
  } finally {
    if (res === null) {
      res = { status: 404 };
    }
    console.log(res);
    return res;
  }
};

export const resetPassword = async (NewPassword) => {
  let res = null;
  try {
    res = await axios.put(
      `${baseUrl}/auth/resetpassword`,
      {
        NewPassword,
        ConfirmPassword: NewPassword,
      },
      {
        headers: {
          "reset-token": localStorage.getItem("Api_Reset_token") || "",
        },
      }
    );
  } catch (error) {
    throw error;
  } finally {
    if (res === null) {
      res = { status: 404 };
    }
    return res;
  }
};
