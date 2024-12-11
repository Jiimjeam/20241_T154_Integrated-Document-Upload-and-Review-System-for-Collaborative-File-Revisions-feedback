import './CITLdashboard.css';
import { Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Profileupload from './profile';
import Swal from "sweetalert2";

import { FaHome, FaCog, FaHistory, FaFileAlt } from 'react-icons/fa';





const CITLdashboard = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {

    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!"
    }).then((result) => {
      if (result.isConfirmed) {
        
        Swal.fire({
          title: "Logged out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 2000, 
          showConfirmButton: false
        });
        logout();
      }
    });
    
  };

  return (
    <div className="dashboard-container d-flex">
      {/* Sidebar */}
      <aside className="sidebar bg-dark text-white p-4 d-flex flex-column align-items-center position-fixed vh-100">
        <div className="profile-section text-center mb-4">
          <Profileupload />
          <h4 className="profile-title text-info">CITL</h4>
          <p className="profile-detail">{user.name}</p>
          <p className="profile-detail">{user.email}</p>
        </div>
        <nav className="menu w-100 mb-4">
          <Link to="/CITL/Home" className="menuItem d-flex align-items-center p-3 text-white">
          <FaHome className="menu-icon mr-3" size={24} />
            <span>Home</span>
          </Link>
          <Link to="/CITL/" className="menuItem d-flex align-items-center p-3 text-white">
          <FaCog className="menu-icon mr-3" size={24} />
            <span>Settings</span>
          </Link>
          <Link to="/CITL/" className="menuItem d-flex align-items-center p-3 text-white">
          <FaHistory className="menu-icon mr-3" size={24} />
            <span>History</span>
          </Link>
          <Link to="/CITL/Colleges" className="menuItem d-flex align-items-center p-3 text-white">
          <FaFileAlt className="menu-icon mr-3" size={24} />
            <span>Colleges Syllabi</span>
          </Link>
        </nav>
        <button className="btn btn-danger mt-auto w-100" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="main-content ml-250 p-4 w-100">
        <div className="container">
          {/* Render child routes */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CITLdashboard;
