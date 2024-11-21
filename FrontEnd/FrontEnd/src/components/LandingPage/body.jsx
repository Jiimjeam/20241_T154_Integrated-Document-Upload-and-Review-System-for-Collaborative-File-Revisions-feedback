import React from 'react';
import { useNavigate } from 'react-router-dom';
import './body.css';

import logo from '../../assets/file-svg.svg';
import CITL from '../../assets/CITLlogo.jpg';
import Navbar from './navbar';
import TypeWriter from './typewriterAnimation';

const Body = () => {


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

      <section id='1'>
  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
      <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full shadow-effect">
        <img
          alt=""
          src="https://plus.unsplash.com/premium_photo-1677341558055-832134a85ad6?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="absolute inset-0 h-full w-full object-cover hover-shadow"
        />
      </div>

      <div className="lg:py-24">
        <h2 className="text-3xl font-bold sm:text-4xl text-white">About the Syllabus</h2>

        <p className="mt-4 text-gray-300 justify-text">
        Our platform is designed to streamline and enhance the process of syllabus review and finalization, 
        tailored specifically for the needs of Bukidnon State University instructors and syllabus checkers.
        By providing an intuitive and user-friendly interface, the platform enables instructors to
        efficiently upload, suggest recommendation, and manage their syllabi while ensuring compliance with institutional 
        guidelines.
        </p>

        <a
          href="#"
          className="mt-8 inline-block rounded bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400"
        >
          Get Started Today
        </a>
      </div>
    </div>
  </div>
</section>
    </main>
  );
};

export default Body;
