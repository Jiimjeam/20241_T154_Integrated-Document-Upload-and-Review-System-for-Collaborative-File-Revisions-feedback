import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React from 'react';
import fileSvg from './assets/file-svg.svg';

function App() {

  return (

<body>

<nav>
  <a href="#">Login</a>
  <a href="#">Sign up</a>
</nav>

<div class = "text-container">
  <header>
      <div class="logo">
          Syllabus<span>Check</span>
      </div>
  </header>

  <div class = "svg">
    <img src={fileSvg} alt="SVG file" />
  </div>

  <div class="container">
      <h3>Relevant Authorities</h3>
      <div class="authorities">   
          <p class="authority-name">CITL</p>     
          <p class="authority-name">Senior Faculty</p>
      </div>
  </div>
</div>
</body>
  )
}

export default App
