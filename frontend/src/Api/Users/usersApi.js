import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_API_URL;

/**
 * Axios client configured for cookie-based authentication.
 * It automatically sends cookies with each request.
 *
 * Requirements:
 * - Backend CORS must allow credentials.
 * - Cookies must be set correctly (HttpOnly + SameSite/Secure as needed).
 */
const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

/**
 * Normalize and throw a friendly error message.
 * Replace with your own throwNiceError if you already have it.
 *
 * @param {any} error Axios error
 * @throws {Error}
 */
const throwNiceError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong";
  throw new Error(message);
};

/* ============================================================
   USERS API
============================================================ */

/**
 * Fetch all users (Admin Route)
 * Endpoint: GET /user/getallusers
 * @returns {Promise<object>}
 */
export const getAllUsers = async () => {
  try {
    const { data } = await apiClient.get("/user/getallusers");
    return data;
  } catch (error) {
    console.error("Get all users error:", error);
    throwNiceError(error);
  }
};

/**
 * Fetch logged-in user (student/admin) data
 * Endpoint: GET /user/getme
 * @returns {Promise<object>}
 */
export const getMe = async () => {
  try {
    const { data } = await apiClient.get("/user/getme");
    return data;
  } catch (error) {
    console.error("Get me error:", error);
    throwNiceError(error);
  }
};

/* ============================================================
   REGISTRATION API
============================================================ */

/**
 * Get all available subjects the student can register
 * Endpoint: GET /registration/available-subjects
 * @returns {Promise<object>}
 */
export const getAvaliableSubjects = async () => {
  try {
    const { data } = await apiClient.get("/registration/available-subjects");
    return data;
  } catch (error) {
    console.error("Get available-subjects error:", error);
    throwNiceError(error);
  }
};

/**
 * Get registered schedule (enrollments)
 * Endpoint: GET /registration/registered-schedule
 * @returns {Promise<object>}
 */
export const getRegisteredSchadule = async () => {
  try {
    const { data } = await apiClient.get("/registration/registered-schedule");
    return data;
  } catch (error) {
    console.error("Get registered-schedule error:", error);
    throwNiceError(error);
  }
};

/**
 * Register a subject by GroupID (NOW: GroupID in URL)
 * Endpoint: POST /registration/register-subject/:GroupID
 * @param {number|string} GroupID
 * @returns {Promise<object>}
 */
export const registerSubject = async (GroupID) => {
  try {
    if (!GroupID) throw new Error("GroupID is required");
    const { data } = await apiClient.post(
      `/registration/register-subject/${GroupID}`
    );
    return data;
  } catch (error) {
    console.error("registerSubject error:", error);
    throwNiceError(error);
  }
};

/**
 * Drop enrollment by GroupID (NOW: GroupID in URL)
 * Endpoint: DELETE /registration/drop-enrollment/:GroupID
 * @param {number|string} GroupID
 * @returns {Promise<object>}
 */
export const dropSubject = async (GroupID) => {
  try {
    if (!GroupID) throw new Error("GroupID is required");
    const { data } = await apiClient.delete(
      `/registration/drop-enrollment/${GroupID}`
    );
    return data;
  } catch (error) {
    console.error("dropSubject error:", error);
    throwNiceError(error);
  }
};

/* ============================================================
   RESULTS API
============================================================ */

/**
 * Get semesters list for the logged student
 * Endpoint: GET /results/semesters-list
 * @returns {Promise<object>}
 */
export const getSemestersList = async () => {
  try {
    const { data } = await apiClient.get("/results/semesters-list");
    return data;
  } catch (error) {
    console.error("Get semesters-list error:", error);
    throwNiceError(error);
  }
};

/**
 * Get results for a specific semester
 * Endpoint: GET /results/my-results/:semesterId
 * @param {string|number} semesterId
 * @returns {Promise<object>}
 */
export const getSemesterResults = async (semesterId) => {
  try {
    if (!semesterId) throw new Error("semesterId is required");
    const { data } = await apiClient.get(`/results/my-results/${semesterId}`);
    return data;
  } catch (error) {
    console.error("Get semester results error:", error);
    throwNiceError(error);
  }
};

/**
 * Get ALL results across all semesters (Dashboard usage)
 * Endpoint: GET /results/my-results/all
 * @returns {Promise<object>}
 */
export const getMyResultsAll = async () => {
  try {
    const { data } = await apiClient.get("/results/my-results/all");
    return data;
  } catch (error) {
    console.error("Get my-results/all error:", error);
    throwNiceError(error);
  }
};

/* ============================================================
   APPEALS API
============================================================ */

/**
 * Get my grades (for appeals)
 * Endpoint: GET /appeals/my-grades
 * @returns {Promise<object>}
 */
export const getMyGrades = async () => {
  try {
    const { data } = await apiClient.get("/appeals/my-grades");
    return data;
  } catch (error) {
    console.error("Error getting my grades:", error);
    throwNiceError(error);
  }
};

/**
 * Create appeal (NOW: gradeId in URL)
 * Endpoint: POST /appeals/createappeal/:gradeId
 * @param {number|string} gradeId
 * @param {object} appealData
 * @returns {Promise<object>}
 */
export const createAppeal = async (gradeId, appealData) => {
  try {
    if (!gradeId) throw new Error("gradeId is required");
    if (!appealData) throw new Error("appealData is required");

    const { data } = await apiClient.post(
      `/appeals/createappeal/${gradeId}`,
      appealData,
      { headers: { "Content-Type": "application/json" } }
    );

    return data;
  } catch (error) {
    console.error("Error creating appeal:", error);
    throwNiceError(error);
  }
};

/* ============================================================
   EXAMS SCHEDULE API
============================================================ */

/**
 * Get current user's exam schedule
 * Endpoint: GET /schedules/my-exam-schedule?type=Midterm|Final
 * @param {string} [type]
 * @returns {Promise<object>}
 */
export const getExamSchedule = async (type) => {
  try {
    const { data } = await apiClient.get("/schedules/my-exam-schedule", {
      params: type ? { type } : undefined,
    });
    return data;
  } catch (error) {
    console.error("Error getting exam schedule:", error);
    throwNiceError(error);
  }
};

/* ============================================================
   PAYMENT API
============================================================ */

/**
 * Get student payment/finance status
 * Endpoint: GET /payment/student-payment
 * @returns {Promise<object>}
 */
export const getStudentPayment = async () => {
  try {
    const { data } = await apiClient.get("/payment/student-payment");
    return data;
  } catch (error) {
    console.error("Error getting student payment:", error);
    throwNiceError(error);
  }
};
/* ============================================================
   SURVEY API
============================================================ */

/**
 * Get student survaiable-subjects status
 * Endpoint: GET /evaluations/get-subjects
 * @returns {Promise<object>}
 */
export const getSubjects = async () => {
  try {
    const { data } = await apiClient.get("/evaluations/get-subjects");
    return data;
  } catch (error) {
    console.error("Error getting student Subjects:", error);
    throwNiceError(error);
  }
};

/**
 * Withdraw a subject by EnrollmentID
 * Endpoint: PUT /withdrawal/withdrawal-subject/:EnrollmentID
 * @param {number|string} EnrollmentID
 * @returns {Promise<object>}
 */
export const getSurveyQuestions = async (EnrollmentID) => {
  try {
    if (!EnrollmentID) throw new Error("EnrollmentID is required");

    const { data } = await apiClient.get(
      `/evaluations/pending-eval/${EnrollmentID}`
    );
    return data;
  } catch (error) {
    console.error("Get Questions Error:", error);
    throwNiceError(error);
  }
};

/**
 * Submit evaluation answers
 * Endpoint: POST /evaluations/eval-answers/:EnrollmentID
 * @param {number|string} EnrollmentID
 * @param {Array} answers - The answers to be submitted
 * @returns {Promise<object>}
 */
export const submitSurveyAnswers = async (EnrollmentID, answers) => {
  try {
    if (!EnrollmentID) throw new Error("EnrollmentID is required");
    if (!Array.isArray(answers) || answers.length === 0) {
      throw new Error("Answers are required and should be an array");
    }

    // إعداد البيانات التي سيتم إرسالها
    const requestData = {
      answers: answers,
    };

    // إرسال البيانات عبر POST أو PUT حسب الحاجة
    const { data } = await apiClient.post(
      `/evaluations/eval-answers/${EnrollmentID}`,
      requestData
    );

    return data;
  } catch (error) {
    console.error("Submit Answers Error:", error);
    throwNiceError(error); // يمكنك تعديل هذه الدالة للتعامل مع الأخطاء بشكل ملائم
  }
};

/* ============================================================
   withdrawal API
============================================================ */
/**
 * Get all subjects registered by the student
 * Endpoint: GET /withdrawal/get-subjects
 * @returns {Promise<object>}
 */
export const getRegisteredSubjects = async () => {
  try {
    const { data } = await apiClient.get("/withdrawal/get-subjects");
    return data;
  } catch (error) {
    console.error("Get registered subjects error:", error);
    throwNiceError(error);
  }
};


/**
 * Withdraw a subject by EnrollmentID
 * Endpoint: PUT /withdrawal/withdrawal-subject/:EnrollmentID
 * @param {number|string} EnrollmentID
 * @returns {Promise<object>}
 */
export const withdrawSubject = async (EnrollmentID) => {
  try {
    if (!EnrollmentID) throw new Error("EnrollmentID is required");

    const { data } = await apiClient.put(
      `/withdrawal/withdrawal-subject/${EnrollmentID}`,
    );
    return data;
  } catch (error) {
    console.error("Withdraw subject error:", error);
    throwNiceError(error);
  }
};



/**
 * Restore a withdrawn subject by EnrollmentID
 * Endpoint: PUT /withdrawal/restoring-subject/:EnrollmentID
 * @param {number|string} EnrollmentID
 * @returns {Promise<object>}
 */
export const restoreSubject = async (EnrollmentID) => {
  try {
    if (!EnrollmentID) throw new Error("EnrollmentID is required");

    const { data } = await apiClient.put(
      `/withdrawal/restoring-subject/${EnrollmentID}` // التعديل هنا
    );

    return data;
  } catch (error) {
    console.error("Restore subject error:", error);
    throwNiceError(error);
  }
};

