import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import Login from './Pages/Login.jsx' 
import './App.css';
import Admin from './Pages/admin.jsx';
import AddUser from './Pages/addUser.jsx';

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/HTI-portal/login" element={<Login/>}/>
        <Route path="/HTI-portal/admin" element={<Admin/>}/>
        <Route path="/HTI-portal/admin/adduser" element={<AddUser/>}/>
      </Routes>
    </div>
  );
};

export default App;
