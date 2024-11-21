import './INTRdashboard.css';
import History from '../../assets/history-line.svg';
import Notifications from '../../assets/notif.svg';
import home from '../../assets/home-line.svg';
import { useAuthStore } from '../../store/authStore';
import FileUpload from './FileUpload'; // Updated path to FileUpload
import Profileupload from './profile';

const INTRdashboard = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="profile-section">
          <Profileupload />
          <h3 className='profile-title'>Profile Information</h3>
          <p className='profile-detail'>Name: {user.name}</p>
          <p className='profile-detail'>Email: {user.email}</p>
        </div>
        <nav className="menu">
          <div className="menuItem">
            <img src={home} alt="home" className="menu-icon" />Home
          </div>
          <div className="menuItem">
            <img src={Notifications} alt="Notifications" className="menu-icon" />Notifications
          </div>
          <div className="menuItem">
            <img src={History} alt="History" className="menu-icon" /> History
          </div>
        </nav>
        <button className="logoutButton" onClick={handleLogout}>Logout</button>
      </aside>
      <main className="main-content">
        <FileUpload /> {/* File upload component */}
      </main>
    </div>
  );
};

export default INTRdashboard;
