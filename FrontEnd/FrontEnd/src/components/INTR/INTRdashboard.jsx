import './INTRdashboard.css';
import { Link, Outlet } from 'react-router-dom';
import History from '../../assets/history-line.svg';
import Settings from '../../assets/google.svg';
import home from '../../assets/home-line.svg';
import syllabusIcon from '../../assets/syllabus.svg';
import { useAuthStore } from '../../store/authStore';
import Profileupload from './profile';




const INTRdashboard = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {``  
    logout();
  };

  return (
    <div className="dashboard-container d-flex">
      {/* Sidebar */}
      <aside className="sidebar bg-dark text-white p-4 d-flex flex-column align-items-center position-fixed vh-100">
        <div className="profile-section text-center mb-4">
          <Profileupload />
          <h4 className="profile-title text-info">Profile Information</h4>
          <p className="profile-detail">{user.name}</p>
          <p className="profile-detail">{user.email}</p>
        </div>
        <nav className="menu w-100 mb-4">
          <Link to="/INTRdashboard/Home" className="menuItem d-flex align-items-center p-3 text-white">
            <img src={home} alt="Home" className="menu-icon mr-3" width="24" />
            <span>Home</span>
          </Link>
          <Link to="/INTRdashboard/Settings" className="menuItem d-flex align-items-center p-3 text-white">
            <img src={Settings} alt="Settings" className="menu-icon mr-3" width="24" />
            <span>Settings</span>
          </Link>
          <Link to="/INTRdashboard/history" className="menuItem d-flex align-items-center p-3 text-white">
            <img src={History} alt="History" className="menu-icon mr-3" width="24" />
            <span>History</span>
          </Link>
          <Link to="/INTRdashboard/my-syllabus" className="menuItem d-flex align-items-center p-3 text-white">
            <img src={syllabusIcon} alt="My Syllabus" className="menu-icon mr-3" width="24" />
            <span>My Syllabi</span>
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

export default INTRdashboard;
