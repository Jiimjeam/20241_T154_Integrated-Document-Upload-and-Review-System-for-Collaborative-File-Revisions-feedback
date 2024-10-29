import React, { useState } from 'react';
import './Login.css';
import googleIMG from '../../assets/google.svg'
import eyeOpen from '../../assets/eyeOpen.svg'
import eyeClose from '../../assets/eyeClose.svg'

import TypeAnimation from '../../components/Resources/LandingPage/typewriterAnimation'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              required
            />
            <button type="button" onClick={toggleShowPassword} className="toggle-password">
              {showPassword ? '🙈' : '👁️'}
            </button>
            
          </div>
        </div>
        <button type="submit" className="login-button">Login</button>
        <button type="button" className="google-login-button">
          <img src={googleIMG} alt="Google icon" className="google-icon" />
          Login with Google
        </button>
        <div className="login-links">
          <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
          <a href="/sign-up" className="sign-up-link">Don’t have an account? Sign up</a>
        </div>
      </form>
    </div>
    </>
  );
};

export default Login;
