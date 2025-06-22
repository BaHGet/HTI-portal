import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import Login from './pages/Login' 
import './App.css';

function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login/>}/>
      </Routes>
      </BrowserRouter>


    </div>
  )
}

export default App
