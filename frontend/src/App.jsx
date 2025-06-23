import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import Login from './pages/Login' 
import './App.css';

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/HTI-portal/" element={<Login/>}/>
      </Routes>
    </div>
  );
};

export default App;
