import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import "./index.css";
import NewLogin from "./Pages/NewLogin.jsx";

const App = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/new-login" element={<NewLogin />} />
      </Routes>
    </div>
  );
};

export default App;
