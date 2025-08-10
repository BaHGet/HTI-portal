import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import "./index.css";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import DashboardPage from "./Pages/dashboard/page.jsx";
import Layout from "./Pages/Layout.jsx";
import Registration from "./Pages/dashboard/Registration.jsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: "results",
          element: <h1 className="title capitalize">النتائج</h1>,
        },
        {
          path: "reports",
          element: <h1 className="title capitalize">التقارير</h1>,
        },
        {
          path: "payments",
          element: <h1 className="title capitalize">المصروفات</h1>,
        },
        {
          path: "registeration",
          element: <Registration />,
        },
        {
          path: "withdrawal",
          element: <h1 className="title capitalize">الانسحاب من المقررات</h1>,
        },
        {
          path: "Petitions",
          element: <h1 className="title capitalize">الالتماسات</h1>,
        },
        {
          path: "regulations",
          element: <h1 className="title capitalize">اللوائح الدراسية</h1>,
        },
        {
          path: "create-table",
          element: <h1 className="title capitalize">عمل جدول</h1>,
        },
        {
          path: "materials",
          element: <h1 className="title capitalize">بنك المواد</h1>,
        },
        {
          path: "student-affairs",
          element: <h1 className="title capitalize">التواصل مع شؤون الطلاب</h1>,
        },
        {
          path: "faculty-members",
          element: <h1 className="title capitalize">اعضاء هيئة التدريس</h1>,
        },
        {
          path: "complaints-and-suggestions",
          element: <h1 className="title capitalize">الشكاوي والاقتراحات</h1>,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    { path: "*", element: <NotFoundPage /> },
  ]);

  return (
    <div className=" items-center inset-0 justify-center bg-gray-100">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
