import { Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoadingSpinner from "./components/LoadingSpinner";

import Settings from './components/INTR/Settings';
import INTRdashboard from "./components/INTR/INTRdashboard";
import MySyllabus from "./components/INTR/MySyllabus";
import Home from './components/INTR/Home';
import Calendar from './components/INTR/history';
import Feedback from './components/INTR/Feedback';

import Admin from './pages/admindashboard'
import AdminApproval from './pages/adminApproval';
import ExistingUsers from './pages/existingUsers';

import LandingPage from './components/LandingPage/body';
import SeniorFacultyDashboard from "./components/SENF/SeniorFacultyDashboard";
import SettingsSENF from './components/SENF/SettingsSENF';
import MySyllabi from './components/SENF/MySyllabi';
import SCalendar from './components/SENF/SCalendar';
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";



import ProgramChairDashboard from './components/PROGRAMCHAIR/ProgramChairDashboard';
import Program from './components/PROGRAMCHAIR/Program';
import Syllabi from './components/PROGRAMCHAIR/Syllabi';
import CollegeDepartment from './components/PROGRAMCHAIR/CollegeDepartment';
import PCalendar from './components/PROGRAMCHAIR/PCalendar';

import Colleges from './components/CITL/Colleges';
import COT from './components/CITL/COT';
import IT_EMCFiles from './components/CITL/IT_EMCFiles';
import Mathematics from './components/CITL/Mathematics';
import CAS from './components/CITL/CAS';

import Senior from './components/SENF/Senior';
import PendingPage from './pages/pendingPage';
import CITLdashboard from './components/CITL/CITLdashboard';
import CITLhome from './components/CITL/CITLhome';
import CITLHistory from './components/CITL/History';
import CCalendar from './components/CITL/CCalendar';

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!user.isVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  return children;
};

// Redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/INTRdashboard' replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#2C2A2A] flex items-center justify-center relative overflow-hidden">
      <Routes>
        <Route path='/' element={<LandingPage />} />
        {/*<Route path="/senior-faculty-dashboard" element={<SeniorFacultyDashboard />} />*/}
        {/*<Route path="/program-chair-dashboard" element={<ProgramChairDashboard />} /> */}
        {/*<Route path="/colleges" element={<Colleges />} />*/}
        <Route path="/colleges/cot" element={<COT />} />
        <Route path="/cot/it_emc" element={<IT_EMCFiles />} />
        <Route path="/colleges/cas" element={<CAS />} />
        <Route path="/cas/mathematics" element={<Mathematics />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path='/signup' element={
          <RedirectAuthenticatedUser>
            <SignUpPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/login' element={
          <RedirectAuthenticatedUser>
            <LoginPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/verify-email' element={<EmailVerificationPage />} />
        <Route path='/forgot-password' element={
          <RedirectAuthenticatedUser>
            <ForgotPasswordPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/reset-password/:token' element={
          <RedirectAuthenticatedUser>
            <ResetPasswordPage />
          </RedirectAuthenticatedUser>
        } />

        {/* Nested Routes for INTRdashboard */}
        <Route path='/INTRdashboard' element={
          <ProtectedRoute>
            <INTRdashboard />
          </ProtectedRoute>
        }>

			<Route path='Home' element={<Home />} />	
          <Route path='my-syllabus' element={<MySyllabus />} />
          <Route path='Settings' element={<Settings />} />
          <Route path='Calendar' element={<Calendar />} />
          <Route path='Feedback' element={<Feedback />} />
      </Route>

       

      {/* Nested Routes for SENF */}
      <Route path='/Senior' element={
          <ProtectedRoute>
            <Senior />
          </ProtectedRoute>}>

			    <Route path='Home' element={<Home />} />	
          <Route path='Calendar' element={<SCalendar />} />
          <Route path='my-syllabi' element={<MySyllabi />} />
          <Route path='SettingsSENF' element={<SettingsSENF />} />
          <Route path='history' element={<History />} />
          <Route path='Feedback' element={<Feedback />} />
      </Route>




       {/* Nested Routes for ProgramChair */}
       <Route path='/Program' element={
          <ProtectedRoute>
            <Program />
          </ProtectedRoute>
        }>

          <Route path='Calendar' element={<PCalendar />} />
          <Route path='Syllabi' element={<Syllabi />} />
          <Route path="collegeDepartment" element={<CollegeDepartment />}></Route>

      </Route>


       {/* Nested Routes for CITL */}
       <Route
          path="/CITL" element={
          <ProtectedRoute>
            <CITLdashboard />
            </ProtectedRoute>}
        >
          <Route path='Home' element={<CITLhome />} />
          <Route path='Calendar' element={<CCalendar />} />
          <Route path='history' element={<CITLHistory />} />
          <Route path="Colleges" element={<Colleges />}>
            <Route path="cot" element={<COT />}>
                {/* Nested routes for departments */}
                <Route path="it_emc" element={<IT_EMCFiles />} />
                <Route path="automotive" element={<div>Automotive Department Content</div>} />
                <Route path="electronics" element={<div>Electronics Department Content</div>} />
                <Route path="food-tech" element={<div>Food Technology Department Content</div>} />
            </Route>
            <Route path="cas" element={<CAS />}>
                <Route path="mathematics" element={<Mathematics />} />
                <Route path="biology" element={<div>Biology Department Content</div>} />
                <Route path="chemistry" element={<div>Chemistry Department Content</div>} />
                <Route path="physics" element={<div>Physics Department Content</div>} />
            </Route>
          </Route>
        </Route>

         {/* Admin Routes with ProtectedRoute */}
      <Route
          path="Admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        >
          {/* Nested Routes */}
          <Route path="existing-users" element={<ExistingUsers />} />
          <Route path="approve" element={<AdminApproval />} />
        </Route>    
       


        

       
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;