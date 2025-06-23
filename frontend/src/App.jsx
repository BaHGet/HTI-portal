import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import Login from './pages/Login.jsx' 
import './App.css';

const App = () => {
  console.log('App');
  return (
    <div>
      <Routes>
        <Route path="/HTI-portal/" element={<Login/>}/>
      </Routes>
    </div>
  );
};

export default App;
