import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const ExistingUsers = () => {
  const [approvedAccounts, setApprovedAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch approved accounts from the backend
  const fetchApprovedAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/auth/users");
      if (response.status === 200) {
        setApprovedAccounts(response.data);
        setFilteredAccounts(response.data);
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

  // Handle edit user role
  const handleEdit = async (userId) => {
    const selectedAccount = approvedAccounts.find((account) => account._id === userId);
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
      try {
        const response = await axios.patch(`http://localhost:5000/api/auth/users/${userId}/role`, { role: newRole });
        if (response.status === 200) {
          setApprovedAccounts((prev) =>
            prev.map((account) => (account._id === userId ? { ...account, role: newRole } : account))
          );
          setFilteredAccounts((prev) =>
            prev.map((account) => (account._id === userId ? { ...account, role: newRole } : account))
          );
          Swal.fire("Success", "Role updated successfully", "success");
        } else {
          Swal.fire("Error", "Failed to update the role", "error");
        }
      } catch (err) {
        Swal.fire("Error", "Failed to update the role", "error");
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
                <td className="px-6 py-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(account._id)}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(account._id)}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-700"
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
