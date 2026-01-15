import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Cookies from "js-cookie";

import Login from "./Pages/Login.jsx";
import "./index.css";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import DashboardPage from "./Pages/dashboard/page.jsx";
import Layout from "./Pages/Layout.jsx";
import Registration from "./Pages/dashboard/Registration.jsx";
import Withdrawal from "./Pages/dashboard/withdrawal.jsx";
import Results from "./Pages/dashboard/Results.jsx";
import Appeals from "./Pages/dashboard/Appeals.jsx";
import Payments from "./Pages/dashboard/Payments.jsx";
import FeedbackPage from "./Pages/dashboard/FeedbackPage.jsx";
import FacultyDirectory from "./Pages/dashboard/FacultyDirectory.jsx";
import StudentServicesPage from "./Pages/dashboard/StudentServicesPage.jsx";
import ExamsTables from "./Pages/dashboard/ExamsTables.jsx";
import Survey from "./Pages/dashboard/Survey.jsx";

function RequireAuth() {
  const location = useLocation();
  const token = Cookies.get("jwt"); // اسم الكوكي اللي الباك بيحطه

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 🔒 Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="results" element={<Results />} />
            <Route path="exams-tables" element={<ExamsTables />} />
            <Route path="payments" element={<Payments />} />
            <Route path="surveys" element={<Survey />} />
            <Route path="registeration" element={<Registration />} />
            <Route path="withdrawal" element={<Withdrawal />} />
            <Route path="Petitions" element={<Appeals />} />
            <Route path="student-affairs" element={<StudentServicesPage />} />
            <Route path="faculty-members" element={<FacultyDirectory />} />
            <Route
              path="complaints-and-suggestions"
              element={<FeedbackPage />}
            />

            {/* صفحات placeholder */}
            <Route
              path="regulations"
              element={<h1 className="title capitalize">اللوائح الدراسية</h1>}
            />
            <Route
              path="create-table"
              element={<h1 className="title capitalize">عمل جدول</h1>}
            />
            <Route
              path="materials"
              element={<h1 className="title capitalize">بنك المواد</h1>}
            />
          </Route>
        </Route>

        {/* ❌ Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
