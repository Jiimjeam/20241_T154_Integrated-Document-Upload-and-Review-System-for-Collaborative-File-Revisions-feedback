import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaUsers, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore.js'; 
import axios from 'axios';
import Swal from 'sweetalert2';
import Profileupload from '../components/INTR/profile.jsx';

const AdminHome = () => {
  const { user, logout } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/auth/getusers')
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );

    setFilteredUsers(filtered);
  };

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete user!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/api/auth/deleteuser/${userId}`)
          .then(() => {
            const updatedUsers = users.filter((user) => user._id !== userId);
            setUsers(updatedUsers); // Update the main user list
            setFilteredUsers(updatedUsers); // Update the filtered user list
            Swal.fire("Deleted!", "User has been deleted.", "success");
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Error!", "Unable to delete user.", "error");
          });
      }
    });
  };

  return (
    <motion.div
      className="dashboard-container flex"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sidebar */}
      <aside
        className={` sidebar bg-dark text-white p-4 flex flex-col items-center fixed h-full z-10 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:w-[250px]`}
      >
        <nav className="menu w-full mb-4">
          <Profileupload />
          <p className="text-center">{user.name}</p>
          <p className="text-center text-sm">Admin</p>
          
          <Link to="/admin/home" className="menuItem flex items-center p-3 text-white hover:bg-gray-700 rounded-md">
            <FaHome className="menu-icon mr-3" size={24} />
            <span>Home</span>
          </Link>

          <Link to="/admin/user" className="menuItem flex items-center p-3 text-white hover:bg-gray-700 rounded-md">
            <FaUsers className="menu-icon mr-3" size={24} />
            <span>Users</span>
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
    </motion.div>
  );
};

export default AdminHome;
