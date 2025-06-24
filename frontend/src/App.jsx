import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import Login from './Pages/Login.jsx' 
import './App.css';

const App = () => {
  console.log('App after ci done and push to gh-pages');
  return (
    <div>
      <Routes>
        <Route path="/HTI-portal/" element={<Login/>}/>
      </Routes>
    </div>
  );
};

export default App;
