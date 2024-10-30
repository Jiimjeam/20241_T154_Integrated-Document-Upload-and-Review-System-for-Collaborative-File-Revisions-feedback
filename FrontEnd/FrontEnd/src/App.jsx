// import React from 'react';
// import Navbar from './components/Resources/LandingPage/navbar';
// import Body from './components/Resources/LandingPage/body';
// import ScrollDownArrow from './components/Resources/LandingPage/downAnimation';
// import InstructorDashboards from './components/Resources/INTR/INTRdashboard'
// import Uploadfile from './components/Resources/INTR/uploadFile'
// import Typewriter from './components/Resources/LandingPage/typewriterAnimation'
// import History from './components/Resources/INTR/history'
// // import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import Login from './components/Resources/forms/Login'
// import Signup from './components/Resources/forms/SignUp'

// import './index.css'

// const App = () => {
//   return (

//     <div>

//           {/* <BrowserRouter>
//       <Routes>
//         <Route path='/' element={<Body/>}> </Route> */}
//         {/* <Route path='/login' element={<Login/>}></Route>
//         <Route path='/signin' element={<Signin/>}></Route> */}
//       {/* </Routes> */}
//     {/* // </BrowserRouter> */}


//       <Body />
//       <ScrollDownArrow />

//        {/* <InstructorDashboards />   */}
      
//        {/* <History />  */}

//        {/* <Login />   */}

//        {/* <Signup /> */}
      
//     </div>

 

//   );
// };

// export default App;







import React, { useState } from 'react';
import Modal from './components/Resources/modals';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
<>
    <div>
      <button onClick={openModal}>Open Modal</button>
      
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Modal Title</h2>
        <p>This is a simple modal example.</p>
      </Modal>
    </div>
    
   
    </>
  );
};

export default App;

