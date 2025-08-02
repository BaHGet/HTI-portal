import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_API_URL;

const getAllUsers = async () => {
  try {
    const response = await axios.get(`${baseUrl}/getallusers`);
    return response.data;
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};

const getMe = async () => {
  try {
    const response = await axios.get(`${baseUrl}/user/getme`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Api_token")}`,
      },
    });
    if (response.data && response.data._id) {
      document.cookie = `user_id=${response.data._id}; path=/;`;
    }
    return response.data;
  } catch (error) {
    console.error("Get me error:", error);
    throw error;
  }
};
export { getAllUsers, getMe };
