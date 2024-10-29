import React from 'react';
import Navbar from './components/Resources/LandingPage/navbar';
import Body from './components/Resources/LandingPage/body';
import ScrollDownArrow from './components/Resources/LandingPage/downAnimation';
import InstructorDashboards from './components/Resources/INTR/INTRdashboard'
import Uploadfile from './components/Resources/INTR/uploadFile'
import Typewriter from './components/Resources/LandingPage/typewriterAnimation'
import History from './components/Resources/INTR/history'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './components/forms/Login'
import Signup from './components/forms/SignUp'

import './index.css'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Body/>}> </Route>
        {/* <Route path='/login' element={<Login/>}></Route>
        <Route path='/signin' element={<Signin/>}></Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
