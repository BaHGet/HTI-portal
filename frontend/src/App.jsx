import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import "./index.css";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import InternalServerErrorPage from "./Pages/InternalServerErrorPage.jsx";

const App = () => {
  return (
    
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/500" element={<InternalServerErrorPage />} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;