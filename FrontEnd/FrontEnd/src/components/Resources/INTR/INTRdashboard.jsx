import React, { useState } from 'react';
import './INTRdashboard.css';
import History from '../../../assets/history-line.svg'
import Notifications from '../../../assets/notif.svg'
import home from '../../../assets/home-line.svg'

import FileUpload from './uploadFile'
import Profileupload from './profile'


const InstructorDashboard = () => {

  return (
    <div className="container">
      <div className="sidebar">
        <div className="profile">
          <Profileupload />
          <p className="profileName">Bryan Kanga</p>
          <p className="profileDept">IT Instructor</p>
        </div>
        <div className="menuItem">
          <img src={home} alt="home" className="history" />Home
        </div>
          
        <div className="menuItem">
          <img src={Notifications} alt="Notifications" className="history" />Notifications
        </div>

        <div className="menuItem">
          <img src={History} alt="History" className="history" /> History
        </div>

        <button className="logoutButton">Logout</button>
      </div>

     
      <div className="mainContent">
        <FileUpload />                          {/* componenet ni sya */}
      </div>
    </div>
  );
}


export default InstructorDashboard;
