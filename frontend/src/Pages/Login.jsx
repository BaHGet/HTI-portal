import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import img from '../assets/1.jpg';
import axios from 'axios';

const Login =  () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!id || !password) {
      return setErrorMessage('Please enter both National ID and Password.');
    }

    if (!/^\d+$/.test(id)) {
      return setErrorMessage('ID must contain numbers only.');
    }

    if(id.length !== 8) {
      return setErrorMessage('ID must be 8 digits.');
    }

    const data = { id, password };
    console.log(data);

    const loginData = { id, password };

    try {
      await axios.post('https://example.com/api/login', loginData);
    } catch {
      setErrorMessage('Login failed. Please check your ID and password.');
    }

  };

  return (
    <div className="bg-white" style={{ maxHeight: '100vh' }}>
      <div className="d-flex justify-content-center align-items-center max-vh-100">
        <div className="card p-4 shadow-lg" style={{ width: '20rem' }}>
          <div className="d-flex justify-content-center mb-4">
            <img
              src={img}
              alt="Logo"
              style={{ width: '150px', height: '135px' }}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Username"
                value={id}
                onChange={(e) => {setId(e.target.value); setErrorMessage('');}}
                className="form-control form-control-sm"
              />
            </div>

            <div className="mb-3">
              <input
                autoComplete="off"
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password"
                value={password}
                onChange={(e) => {setPassword(e.target.value); setErrorMessage('');}}
                className="form-control form-control-sm"
              />
            </div>

            <div className="mb-3 d-flex align-items-center gap-1">
              <input 
                type="checkbox"
                className="form-check-input p-0 m-0"
                style={{ width: '14px', height: '14px' }}
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                id="showPass"
              />
              <label 
                htmlFor="showPass" 
                className="form-check-label" 
                style={{ fontSize: '13px', marginBottom: 0 }}
              >
                Show Password
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-sm w-100 mb-3">
              Login
            </button>

            {errorMessage && (
              <div className="alert alert-danger py-1 mb-2 text-center" style={{ fontSize: '14px' }}>
                {errorMessage}
              </div>
            )}

            <div className="text-center">
              <a href="#" className="text-decoration-none text-primary small" onClick={() => {setErrorMessage('ابلع بقي ');}}>
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;