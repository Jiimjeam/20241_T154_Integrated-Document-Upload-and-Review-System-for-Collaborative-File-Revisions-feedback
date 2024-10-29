import React, { useState } from 'react';
import './SignUp.css';
import googleIMG from '../../../assets/google.svg'
import eyeOpen from '../../../assets/eyeOpen.svg'
import eyeClose from '../../../assets/eyeClose.svg'

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [officePasscode, setOfficePasscode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleofficePasscodeChange = (e) => setOfficePasscode(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
    <div className="login-container">
      <h2>Sign Up</h2>
      <form className="login-form">
        <div className='group1'>
            <div className="form-group">
              <div className='nameInput'>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
                required
              />
              </div>
            </div>
          

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your Email"
              required
            />
          </div>
        </div>


        <div className='group2'>
          <div className="form-group">
            <label>Office Passcode</label>
            <input
              type="number"
              value={officePasscode}
              onChange={handleofficePasscodeChange}
              placeholder="Enter your Email"
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
        </div>
        <button type="submit" className="login-button">Login</button>
        <button type="button" className="google-login-button">
          <img src={googleIMG} alt="Google icon" className="google-icon" />
          Sign Up with Google
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
