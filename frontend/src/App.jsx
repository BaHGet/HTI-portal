import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  Router,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Login from "./Pages/Login.jsx";
import "./index.css";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import DashboardPage from "./Pages/dashboard/page.jsx";
import Layout from "./Pages/Layout.jsx";
import Registration from "./Pages/dashboard/Registration.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route
            path="results"
            element={<h1 className="title capitalize">النتائج</h1>}
          />
          <Route
            path="reports"
            element={<h1 className="title capitalize">التقارير</h1>}
          />
          <Route
            path="payments"
            element={<h1 className="title capitalize">المصروفات</h1>}
          />
          <Route path="registeration" element={<Registration />} />
          <Route
            path="withdrawal"
            element={<h1 className="title capitalize">الانسحاب من المقررات</h1>}
          />
          <Route
            path="Petitions"
            element={<h1 className="title capitalize">الالتماسات</h1>}
          />
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
