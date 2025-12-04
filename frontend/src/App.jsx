import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="results" element={<Results />} />
          <Route
            path="reports"
            element={<h1 className="title capitalize">التقارير</h1>}
          />
          <Route
            path="payments"
            element={<Payments />}
          />
          <Route path="registeration" element={<Registration />} />
          <Route path="withdrawal" element={<Withdrawal />} />
          <Route path="Petitions" element={<Appeals />} />
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
          <Route
            path="student-affairs"
            element={
              <h1 className="title capitalize">التواصل مع شؤون الطلاب</h1>
            }
          />
          <Route
            path="faculty-members"
            element={<h1 className="title capitalize">اعضاء هيئة التدريس</h1>}
          />
          <Route
            path="complaints-and-suggestions"
            element={<h1 className="title capitalize">الشكاوي والاقتراحات</h1>}
          />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
