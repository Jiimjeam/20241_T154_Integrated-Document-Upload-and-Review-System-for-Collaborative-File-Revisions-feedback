import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaUsers, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore.js';
import axios from 'axios';
import Swal from 'sweetalert2';
import Profileupload from '../components/INTR/profile.jsx';

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <motion.div
      className="dashboard-container flex"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >

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

      {/* Main Content */}
      <main
        className={`main-content p-4 w-full transition-all duration-300 ${
          isSidebarOpen ? 'ml-[250px]' : 'ml-0'
        }`}
      >
        <button
          className="lg:hidden mb-4 text-white bg-gray-700 p-2 rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FaBars size={24} />
        </button>
        <div className="container">
          <h1 className="text-2xl font-bold mb-4">All Users</h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearch}
              className="px-4 py-2 w-full border rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table-auto w-full bg-gray-800 text-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gray-700 text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Last Login</th>
                  <th className="p-3">Verified</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-700">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{new Date(user.lastLogin).toLocaleString()}</td>
                    <td className="p-3">{user.isVerified ? 'Yes' : 'No'}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default AdminDashboard;
