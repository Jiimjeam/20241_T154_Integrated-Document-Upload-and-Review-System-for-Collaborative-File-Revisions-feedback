import './admindashboard.css';
import { Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Profileupload from './adminProfile';
import Swal from "sweetalert2";
import { FaUsers, FaSignOutAlt, FaBars, FaDashcube } from 'react-icons/fa';  // Added FaBars for the toggle button
import { useState } from 'react';

const Admin = () => {
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);  // Toggling the sidebar open/close state
  };

  return (
    <div className="dashboard-container flex flex-col lg:flex-row w-full">
      {/* Sidebar */}
      <aside
        className={`sidebar bg-dark text-white p-4 flex flex-col items-center fixed h-full z-10 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:w-[250px]`}
      >
        <div className="profile-section text-center mb-4">
          <Profileupload />
          <h4 className="profile-title text-info">{user.role}</h4>
          <p className="profile-detail">{user.name}</p>
          <hr />
        </div>

        <nav className="menu w-full mb-4">
          <Link to="/admin/existing-users" className="menuItem flex items-center p-3 text-white hover:bg-gray-700 rounded-md">
            <FaDashcube className="menu-icon mr-3" size={24} />
            <span>Dashboard</span>
          </Link>

          <Link to="/admin/approve" className="menuItem flex items-center p-3 text-white hover:bg-gray-700 rounded-md">
            <FaUsers className="menu-icon mr-3" size={24} />
            <span>Pending Accounts</span>
          </Link>
        </nav>

        <button
          className="btn btn-danger mt-auto w-full flex justify-center items-center p-3 hover:bg-red-700 rounded-md"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="menu-icon mr-3" size={24} />
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="main-content flex-grow-1 p-4">
        <div className="container-fluid">
          <div className="content-header mb-4">
            <h1 className="content-title">Admin Dashboard</h1>
            <hr />
          </div>

          {/* Toggle Sidebar Button */}
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle-btn lg:hidden p-2 rounded-md"
          >
            <FaBars size={24} />
          </button>

          {/* Render child routes */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Admin;
