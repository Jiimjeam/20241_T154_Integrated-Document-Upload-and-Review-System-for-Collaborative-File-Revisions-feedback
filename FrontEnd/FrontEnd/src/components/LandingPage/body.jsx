import React from 'react';
import { useNavigate } from 'react-router-dom';
import './body.css';

import logo from '../../assets/file-svg.svg';
import CITL from '../../assets/CITLlogo.jpg';
import Navbar from './navbar';
import TypeWriter from './typewriterAnimation';

const Body = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    console.log("LOGIN NAVIGATE")
    navigate('/login'); 
  };

  const handleSignUpClick = () => {
    console.log("SIGNUP NAVIGATE")
    navigate('/signup');
  };

  return (
    <main>
      <Navbar />

      <header className="header">
        <TypeWriter />
        <div className="relevantAuth">
          <h3>Relevant Authorities</h3>
          <img src={CITL} alt="CITL Logo" className="CITL-logo" /> 
          <p>Buksu CITL</p>
        </div>
        <img src={logo} alt="Document Icon" className="logo" />
      </header>

      <section className="section1" id="1">
        <div className="section-1-container">
          <h2>About The <span>Syllabus</span></h2>
          <p>
            Our platform streamlines syllabus checking and finalization within Bukidnon State University, 
            offering a dedicated environment for instructors and syllabus checkers to review, update, and finalize syllabus content efficiently.
          </p>
          {/* Login and Signup buttons */}
          <div className="auth-buttons">

            <button onClick={handleLoginClick}>Login</button>
            <button onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Body;
