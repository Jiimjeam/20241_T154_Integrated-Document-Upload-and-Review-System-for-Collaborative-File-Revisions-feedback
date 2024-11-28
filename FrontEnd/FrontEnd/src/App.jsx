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
import History from './components/INTR/history';

import AdminUsers from './pages/adminUsers'
import AdminHome from './pages/adminHome'

import LandingPage from './components/LandingPage/body';
import SeniorFacultyDashboard from "./components/SENF/SeniorFacultyDashboard";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import ProgramChairDashboard from './components/PROGRAMCHAIR/ProgramChairDashboard';
import Colleges from './components/CITL/Colleges';
import COT from './components/CITL/COT';
import IT_EMCFiles from './components/CITL/IT_EMCFiles';
import Mathematics from './components/CITL/Mathematics';
import CAS from './components/CITL/CAS';

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
        <Route path="/senior-faculty-dashboard" element={<SeniorFacultyDashboard />} />
        <Route path="/program-chair-dashboard" element={<ProgramChairDashboard />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/colleges/cot" element={<COT />} />
        <Route path="/cot/it_emc" element={<IT_EMCFiles />} />
        <Route path="/colleges/cas" element={<CAS />} />
        <Route path="/cas/mathematics" element={<Mathematics />} />
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
          <Route path='history' element={<History />} />
         
        
        </Route>

        <Route path='/admin/home' element={<AdminHome />} />	
        <Route path='/admin/user' element={<AdminUsers />} />	

       
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;