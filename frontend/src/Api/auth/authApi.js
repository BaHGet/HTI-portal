import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_API_URL;

const login = async (email, password) => {
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

export { login };
