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

const getAvaliableSubjects = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/registration/available-subjects`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Api_token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Get available-subjects error:", error);
    throw error;
  }
};

const getRegisteredSchadule = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/registration/registered-schedule`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Api_token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Get registered-schedule error:", error);
    throw error;
  }
};
const registerSubject = async (GroupID) => {
  try {
    if (!GroupID) throw new Error("groupId is required");

    console.log("Registering subject with groupId:", GroupID);

    const response = await axios.post(
      `${baseUrl}/registration/register-subject`,
      { GroupID },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Api_token")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in registerSubject:", error);
    throw error;
  }
};

const dropSubject = async (GroupID) => {
  try {
    if (!GroupID) throw new Error("groupId is required");

    console.log("Dropping subject with groupId:", GroupID);

    const response = await axios.delete(
      `${baseUrl}/registration/drop-enrollment`,
      {
        data: { GroupID }, 
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Api_token")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in dropSubject:", error.response?.data || error);
    throw error;
  }
};


export {
  getAllUsers,
  getMe,
  getAvaliableSubjects,
  getRegisteredSchadule,
  registerSubject,
  dropSubject,
};
