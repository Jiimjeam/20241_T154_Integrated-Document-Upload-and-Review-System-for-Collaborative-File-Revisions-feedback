import './INTRdashboard.css';
import { Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Profileupload from './profile';
import Swal from "sweetalert2";
import { MdFeedback } from 'react-icons/md';
import { FaHome, FaCog, FaFileAlt } from 'react-icons/fa';

const INTRdashboard = () => {
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
    <div className="dashboard-container d-flex flex-column flex-lg-row w-100">
      {/* Sidebar */}
      <aside className="sidebar bg-dark text-white p-4 d-flex flex-column align-items-center vh-100 overflow-auto">
        <div className="profile-section text-center mb-4">
          <Profileupload />
          <h4 className="profile-title text-info">{user.role}</h4>
          <p className="profile-detail">{user.name}</p>
          <p className="profile-detail">{user.email}</p>
          <hr />
        </div>
        <nav className="menu w-100 mb-4">
          <Link to="/INTRdashboard/Home" className="menuItem d-flex align-items-center p-3 text-white">
            <FaHome className="menu-icon me-3" size={24} />
            <span>Home</span>
          </Link>
          <Link to="/INTRdashboard/Settings" className="menuItem d-flex align-items-center p-3 text-white">
            <FaCog className="menu-icon me-3" size={24} />
            <span>College & Department</span>
          </Link>
          <Link to="/INTRdashboard/my-syllabus" className="menuItem d-flex align-items-center p-3 text-white">
            <FaFileAlt className="menu-icon me-3" size={24} />
            <span>My Syllabi</span>
          </Link>
          <Link to="/INTRdashboard/Feedback" className="menuItem d-flex align-items-center p-3 text-white">
            <MdFeedback className="menu-icon me-3" size={24} />
            <span>Feedback</span>
          </Link>
        </nav>
        <button className="btn btn-danger mt-auto w-100" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="main-content flex-grow-1 p-4">
        <div className="container-fluid">
          <div className="content-header mb-4">
            <h1 className="content-title">Instructor Dashboard</h1>
            <hr />
          </div>
          {/* Render child routes */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default INTRdashboard;
