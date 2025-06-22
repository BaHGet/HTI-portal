import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import img from '../assets/1.jpg'; // غيّر المسار حسب مكان الصورة

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { id, password };
    console.log(data);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-white">
      
      {/* الكارت */}
      <div className="card p-4 shadow-lg" style={{ width: '20rem', height: '24rem' }}>
        
        {/* الصورة (كبرناها) */}
        <div className="d-flex justify-content-center mb-2">
          <img
            src={img}
            alt="Logo"
            style={{ width: '150px', height: '135px' }} // ← كبرنا الصورة
          />
        </div>

        {/* الفورم */}
        <form onSubmit={handleSubmit}>
          <div className="mt-5 mb-2">
            <input
              type="text"
              placeholder="Id \National Id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="form-control form-control-sm"
            />
          </div>

          <div className="mb-2">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control form-control-sm"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-sm w-100 mb-2">
            Login
          </button>

          <div className="text-center">
            <a href="#" className="text-decoration-none text-primary small">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
