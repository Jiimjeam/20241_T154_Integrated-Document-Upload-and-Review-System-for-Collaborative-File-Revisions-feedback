import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaLock, FaUnlock } from "react-icons/fa";
import Swal from "sweetalert2";

const ExistingUsers = () => {
  const [approvedAccounts, setApprovedAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lockStatus, setLockStatus] = useState({}); // State to store lock status for each user
  const [timeoutStatus, setTimeoutStatus] = useState({}); // State to store the timer for lock status update

  const fetchApprovedAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/auth/users");
      if (response.status === 200) {
        setApprovedAccounts(response.data);
        setFilteredAccounts(response.data);
        // Check role lock for each user after loading the users
        checkRoleLocks(response.data);
      } else {
        setError("No approved accounts found.");
      }
    } catch (err) {
      setError("Failed to fetch approved accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedAccounts();
  }, []);

  const checkRoleLocks = async (users) => {
    for (let user of users) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/${user._id}/check-role-lock`
        );
        setLockStatus((prevState) => ({
          ...prevState,
          [user._id]: response.data.lockStatus,
        }));
      } catch (err) {
        console.error("Error checking role lock:", err);
      }
    }
  };

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

    setFilteredAccounts(filtered);
  };

  const handleEdit = async (userId) => {
    const selectedAccount = approvedAccounts.find((account) => account._id === userId);
    console.log("Selected Account:", selectedAccount); // Log selected account

    const { value: newRole } = await Swal.fire({
      title: `Edit Role for ${selectedAccount.name}`,
      input: "select",
      inputOptions: {
        Instructor: "Instructor",
        Senior_Faculty: "Senior Faculty",
        Program_Chair: "Program Chair",
        CITL: "CITL",
        Admin: "Admin",
      },
      inputPlaceholder: "Select new role",
      showCancelButton: true,
    });

    if (newRole) {
      console.log("Selected new role:", newRole); // Log selected role

      try {
        const response = await axios.put(
          `http://localhost:5000/api/auth/${userId}/update-role`,
          {
            role: newRole,
          }
        );

        console.log("API Response:", response); // Log API response

        if (response.status === 200) {
          setApprovedAccounts((prev) =>
            prev.map((account) =>
              account._id === userId ? { ...account, role: newRole } : account
            )
          );
          setFilteredAccounts((prev) =>
            prev.map((account) =>
              account._id === userId ? { ...account, role: newRole } : account
            )
          );
          Swal.fire("Success", "Role updated successfully", "success");

          // Start a timer of 5 minutes to recheck the lock status
          setTimeout(() => {
            // After 5 minutes, recheck the lock status
            checkRoleLockStatus(userId);
          }, 5 * 60 * 1000); // 5 minutes in milliseconds
        } else {
          Swal.fire("Error", "Failed to update the role", "error");
        }
      } catch (err) {
        console.error("Error details:", err); // Log the full error details
        if (err.response) {
          console.error("Error response:", err.response);
          Swal.fire("Error", err.response.data.message || "Failed to update the role", "error");
        } else {
          Swal.fire("Error", "Something went wrong", "error");
        }
      }
    }
  };

  // Handle delete user
  const handleDelete = async (userId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This user will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete!",
        cancelButtonText: "No, cancel",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`http://localhost:5000/api/auth/users/${userId}`);
        if (response.status === 200) {
          setApprovedAccounts((prev) => prev.filter((account) => account._id !== userId));
          setFilteredAccounts((prev) => prev.filter((account) => account._id !== userId));
          Swal.fire("Deleted!", "User has been deleted.", "success");
        }
      }
    } catch (err) {
      Swal.fire("Error", "Failed to delete user", "error");
    }
  };

  // Function to check lock status after the timeout
  const checkRoleLockStatus = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/${userId}/check-role`
      );
      setLockStatus((prevState) => ({
        ...prevState,
        [userId]: response.data.lockStatus,
      }));
    } catch (err) {
      console.error("Error checking role lock:", err);
    }
  };

  // Get the lock/unlock icon based on the lock status
  const getLockIcon = (userId) => {
    if (lockStatus[userId] === "locked") {
      return <FaLock className="text-red-500" />;
    }
    return <FaUnlock className="text-green-500" />;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - User Accounts</h1>

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

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Last Login</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr key={account._id}>
                <td className="px-6 py-4">{account.name}</td>
                <td className="px-6 py-4">{account.email}</td>
                <td className="px-6 py-4">{account.role}</td>
                <td className="px-6 py-4">{account.lastLogin}</td>
                <td className="px-6 py-4 flex space-x-4">
                  {getLockIcon(account._id)}
                  <button
                    onClick={() => handleEdit(account._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(account._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExistingUsers;
