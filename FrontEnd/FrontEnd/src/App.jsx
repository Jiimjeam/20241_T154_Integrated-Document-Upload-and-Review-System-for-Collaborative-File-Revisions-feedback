import React from 'react';
import Navbar from './components/Resources/LandingPage/navbar';
import Body from './components/Resources/LandingPage/body';
import ScrollDownArrow from './components/Resources/LandingPage/downAnimation';
import InstructorDashboards from './components/Resources/INTR/INTRdashboard'
import Uploadfile from './components/Resources/INTR/uploadFile'
import Typewriter from './components/Resources/LandingPage/typewriterAnimation'
import History from './components/Resources/INTR/history'


import './index.css'

const App = () => {
  return (
    <div>
       <Navbar />
      <Body />
      <ScrollDownArrow />

       {/* <InstructorDashboards />   */}
      
       {/* <History />  */}
      
    </div>
  );
};

export default App;
