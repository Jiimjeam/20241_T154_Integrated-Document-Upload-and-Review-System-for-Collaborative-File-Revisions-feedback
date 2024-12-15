import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBars, FaHome, FaUsers, FaSignOutAlt, FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // For navigation
import Swal from "sweetalert2";
import Profileupload from "../components/INTR/profile";

const ExistingUsers = () => {
  const [approvedAccounts, setApprovedAccounts] = useState([]); // State to hold approved users
  const [filteredAccounts, setFilteredAccounts] = useState([]); // Filtered accounts based on search
  const [search, setSearch] = useState(''); // Search input state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar visibility state
  const navigate = useNavigate(); // For navigation

  // Fetch approved accounts from the backend
  const fetchApprovedAccounts = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get("http://localhost:5000/api/auth/users");
      if (response.status === 200) {
        setApprovedAccounts(response.data); // Set approved users data
        setFilteredAccounts(response.data); // Initialize filtered accounts
      } else {
        setError("No approved accounts found.");
      }
    } catch (err) {
      setError("Failed to fetch approved accounts.");
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchApprovedAccounts(); // Fetch data on component mount
  }, []);

  // Handle search functionality
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);

    const filtered = approvedAccounts.filter(
      (account) =>
        account.name.toLowerCase().includes(searchTerm) ||
        account.email.toLowerCase().includes(searchTerm) ||
        account.role.toLowerCase().includes(searchTerm) ||
        account.lastLogin.includes(searchTerm)
    );

    setFilteredAccounts(filtered); // Set filtered accounts
  };

  // Handle logout functionality
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
        // Call logout functionality (you can modify this part as per your auth store)
      }
    });
  };

  const handleEdit = async (userId) => {
    const selectedAccount = approvedAccounts.find((account) => account._id === userId);
  
    // Allow the admin to select a new role
    const { value: newRole } = await Swal.fire({
      title: `Edit Role for ${selectedAccount.name}`,
      input: 'select',
      inputOptions: {
        Instructor: 'Instructor',
        Senior_Faculty: 'Senior Faculty',
        Program_Chair: 'Program Chair',
        CITL: 'CITL',
        Admin: 'Admin',
      },
      inputPlaceholder: 'Select new role',
      showCancelButton: true,
    });
  
    if (newRole) {
      try {
        // Send the updated role to the backend
        const response = await axios.patch(
          `http://localhost:5000/api/auth/users/${userId}/role`,  // Correct API endpoint
          { role: newRole }  // Send the new role as the request body
        );
  
        if (response.status === 200) {
          // Update the UI with the new role
          setApprovedAccounts((prevState) =>
            prevState.map((account) =>
              account._id === userId ? { ...account, role: newRole } : account
            )
          );
          setFilteredAccounts((prevState) =>
            prevState.map((account) =>
              account._id === userId ? { ...account, role: newRole } : account
            )
          );
  
          Swal.fire("Success", "Role updated successfully", "success");
        } else {
          Swal.fire("Error", "Failed to update the role", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to update the role", "error");
      }
    }
  };

  const handleDelete = async (userId) => {
    try {
      // Ask for confirmation before deleting
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This user will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete!",
        cancelButtonText: "No, cancel"
      });
  
      if (result.isConfirmed) {
        // Call delete API (fixed URL)
        const response = await axios.delete(`http://localhost:5000/api/auth/users/${userId}`);
        
        if (response.status === 200) {
          // Remove user from state
          setApprovedAccounts(prevState =>
            prevState.filter(account => account._id !== userId)
          );
          setFilteredAccounts(prevState =>
            prevState.filter(account => account._id !== userId)
          );
  
          Swal.fire("Deleted!", "User has been deleted.", "success");
        }
      }
    } catch (err) {
      Swal.fire("Error", "Failed to delete user", "error");
    }
  };
  
  return (
    <div className="flex">
      {/* Sidebar */}
        <aside
        className={`sidebar bg-dark text-white p-4 flex flex-col items-center fixed h-full z-10 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:w-[250px]`}
      >
        <nav className="menu w-full mb-4">
        <Profileupload />
          <p className="text-center">Arvin Aguid</p>
          <p className="text-center text-sm">Admin</p>
          <hr/>

          <Link to="/admin/home" className="menuItem flex items-center p-3 text-white hover:bg-gray-700 rounded-md">
            <FaHome className="menu-icon mr-3" size={24} />
            <span>Home</span>
          </Link>

          <Link to="/admin/existing-users" className="menuItem flex items-center p-3 text-white hover:bg-gray-700 rounded-md">
            <FaUsers className="menu-icon mr-3" size={24} />
            <span>All Users</span>
          </Link>

          <Link to="/admin/approve" className="menuItem flex items-center p-3 text-white hover:bg-gray-700 rounded-md">
            <FaUsers className="menu-icon mr-3" size={24} />
            <span>Add Users</span>
          </Link>
          <Link to="/admin/approve" className="menuItem flex items-center p-3 text-white hover:bg-gray-700 rounded-md">
            <FaUsers className="menu-icon mr-3" size={24} />
            <span>Add College</span>
          </Link>
        </nav>

        <button
          className="btn btn-danger mt-auto w-full flex justify-center items-center p-3 hover:bg-red-700 rounded-md"
          onClick={() => console.log('Logout')}
        >
          <FaSignOutAlt className="menu-icon mr-3" size={24} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className={`w-[1000px] main-content p-6 w-full transition-all duration-300 ${isSidebarOpen ? "ml-[250px]" : "ml-0"}`}>
        {/* Sidebar toggle for smaller screens */}
        <button className="lg:hidden mb-4 text-white bg-gray-700 p-2 rounded-md" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FaBars size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-4">User Accounts</h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={handleSearch}
            className="px-4 py-2 w-full border rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>

        {/* Table for displaying approved users */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-[1130px] bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-300 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Last Login</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{account.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{account.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{account.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{account.lastLogin}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 flex space-x-2">
                    <button onClick={() => handleEdit(account._id)} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(account._id)} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default ExistingUsers;
