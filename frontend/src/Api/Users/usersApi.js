import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_API_URL;

/**
 * Creates request headers containing the JWT token.
 * @returns {object} Axios headers with Authorization token.
 */
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("Api_token")}`,
  },
});

/* ============================================================
   USERS API
============================================================ */

/**
 * Fetch all users (Admin Route)
 * @returns {Promise<object>} Users list
 */
const getAllUsers = async () => {
  try {
    const response = await axios.get(`${baseUrl}/getallusers`);
    return response.data;
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};

/**
 * Fetch logged-in user information
 * Saves user_id in cookies for global usage
 * @returns {Promise<object>} Current user data
 */
const getMe = async () => {
  try {
    const response = await axios.get(`${baseUrl}/user/getme`, authHeaders());

    if (response.data && response.data._id) {
      document.cookie = `user_id=${response.data._id}; path=/;`;
    }

    return response.data;
  } catch (error) {
    console.error("Get me error:", error);
    throw error;
  }
};

/* ============================================================
   REGISTRATION API
============================================================ */

/**
 * Get all available subjects user can register for
 * @returns {Promise<object>} Subjects list
 */
const getAvaliableSubjects = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/registration/available-subjects`,
      authHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Get available-subjects error:", error);
    throw error;
  }
};

/**
 * Get the schedule of already registered subjects
 * @returns {Promise<object>}
 */
const getRegisteredSchadule = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/registration/registered-schedule`,
      authHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Get registered-schedule error:", error);
    throw error;
  }
};

/**
 * Register user into a subject group
 * @param {number|string} GroupID
 * @returns {Promise<object>}
 */
const registerSubject = async (GroupID) => {
  try {
    if (!GroupID) throw new Error("GroupID is required");

    const response = await axios.post(
      `${baseUrl}/registration/register-subject`,
      { GroupID },
      authHeaders()
    );

    return response.data;
  } catch (error) {
    console.error("registerSubject error:", error);
    throw error;
  }
};

/**
 * Drop an enrolled subject
 * @param {number|string} GroupID
 * @returns {Promise<object>}
 */
const dropSubject = async (GroupID) => {
  try {
    if (!GroupID) throw new Error("GroupID is required");

    const response = await axios.delete(
      `${baseUrl}/registration/drop-enrollment`,
      {
        data: { GroupID },
        ...authHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("dropSubject error:", error);
    throw error;
  }
};

/* ============================================================
   RESULTS API
============================================================ */

/**
 * Fetch list of semesters available for the logged user
 * @returns {Promise<object>}
 */
const getSemestersList = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/results/semesters-list`,
      authHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Get semesters-list error:", error);
    throw error;
  }
};

/**
 * Fetch results of a specific semester
 * @param {string|number} semesterId
 * @returns {Promise<object>}
 */
const getSemesterResults = async (semesterId) => {
  try {
    if (!semesterId) throw new Error("semesterId is required");

    const response = await axios.get(
      `${baseUrl}/results/my-results/${semesterId}`,
      authHeaders()
    );

    return response.data;
  } catch (error) {
    console.error("Get semester results error:", error);
    throw error;
  }
};

/* ============================================================
   APPEALS API
============================================================ */


// Get my grades (for appeals)
const getMyGrades = async () => {
  try {
    const response = await axios.get(`${baseUrl}/appeals/my-grades`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Api_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting my grades:", error);
    throw error;
  }
};

// Submit an appeal
const createAppeal = async (appealData) => {
  try {
    const response = await axios.post(
      `${baseUrl}/appeals/createappeal`,
      appealData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Api_token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating appeal:", error);
    throw error;
  }
};

/* ============================================================
   DEFAULT EXPORT 
============================================================ */

export {
  getAllUsers,
  getMe,
  getAvaliableSubjects,
  getRegisteredSchadule,
  registerSubject,
  dropSubject,
  getSemestersList,
  getSemesterResults,
  getMyGrades,
  createAppeal,
};
