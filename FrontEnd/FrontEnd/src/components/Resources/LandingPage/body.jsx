import React from 'react'
import './body.css'
import logo from '../../../assets/file-svg.svg';
import Nasty from '../../../assets/Nasty.jpg';
import CITL from '../../../assets/CITLlogo.jpg';


import TypeWriter from './typewriterAnimation'

const Body = () => {
  return (
    <div className='header'>
      {/* <h1>Syllabus <span>Review</span></h1> */}
      <TypeWriter />
      <div className='relevantAuth'>
        <h3>Relevant Authrities</h3>
        <img src={CITL} alt="Nasty-Image" className="CITL-logo" /> 
        <p>Buksu CITL</p>
      </div>
      <img src={logo} alt="File.svg" className="logo" /> 



      <section className='section1' id='1'>
        <div className='section-1-container'>
            <h2>About The <span>Syllabus</span></h2>
            <p>
            Our platform streamlines syllabus checking and finalization within Bukidnon State University, 
            offering a dedicated environment for instructors and syllabus checkers to review, update, and finalize syllabus content efficiently.
            </p>
        </div>
      </section>
    </div>

    
    
  )
}

export default Body
