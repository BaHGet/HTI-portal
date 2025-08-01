import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import Login from './Pages/Login.jsx' 
import './App.css';
import NewLogin from './Pages/NewLogin.jsx';

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/new-login" element={<NewLogin />} />
      </Routes>
    </div>
  );
};

export default App;
