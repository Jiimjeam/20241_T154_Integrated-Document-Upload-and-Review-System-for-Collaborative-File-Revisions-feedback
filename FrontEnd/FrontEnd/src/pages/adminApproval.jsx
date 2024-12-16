import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTimes } from 'react-icons/fa';  // Importing necessary icons
import Swal from "sweetalert2";

const AdminApproval = () => {
  const [noPendingAccounts, setNoPendingAccounts] = useState(false);
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending accounts from the backend
  const fetchPendingAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/auth/admin/get/pending-accounts");

      if (response.status === 404 && response.data.message === "No pending accounts found") {
        setNoPendingAccounts(true);
        setPendingAccounts([]);
        setError(null);
      } else if (response.status === 200) {
        setPendingAccounts(response.data);
        setNoPendingAccounts(false);
        setError(null);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError("No pending accounts");
      setNoPendingAccounts(false);
      setLoading(false);
    }
  };

  // Handle account approval with confirmation
  const approveAccount = async (userId, role) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to approve this account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`http://localhost:5000/api/auth/admin/approve-user/${userId}`, { status: "Approved", role })
          .then((response) => {
            Swal.fire("Approved!", "The account has been approved.", "success");
            fetchPendingAccounts();  // Refresh pending accounts list after approval
          })
          .catch((err) => {
            console.error("Error approving account:", err);
            Swal.fire("Error!", "There was an issue approving the account.", "error");
          });
      }
    });
  };

  // Handle account rejection with confirmation
  const declineAccount = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to reject this account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`http://localhost:5000/api/auth/admin/approve-user/${userId}`, { status: "Rejected" })
          .then((response) => {
            Swal.fire("Rejected!", "The account has been rejected.", "success");
            fetchPendingAccounts();  // Refresh pending accounts list after rejection
          })
          .catch((err) => {
            console.error("Error rejecting account:", err);
            Swal.fire("Error!", "There was an issue rejecting the account.", "error");
          });
      }
    });
  };

  // Handle role change for each account
  const handleRoleChange = (e, userId) => {
    setPendingAccounts((prevState) =>
      prevState.map((account) =>
        account._id === userId ? { ...account, role: e.target.value } : account
      )
    );
  };

  useEffect(() => {
    fetchPendingAccounts();
  }, []);

  return (
    <div className="main-content p-4 w-full">
      {/* Pending Accounts Section */}
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">Pending Accounts</h1>
        {loading ? (
          <p>Loading pending accounts...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div>
            <table className="max-w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
              {/* Table Header */}
              <thead className="bg-gray-300 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {pendingAccounts.length > 0 ? (
                  pendingAccounts.map((account) => (
                    <tr key={account._id} className="border-b border-gray-700">
                      <td className="px-6 py-4 text-sm text-gray-800">{account.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{account.email}</td>
                      <td>
                        <select
                          value={account.role || ""}
                          onChange={(e) => handleRoleChange(e, account._id)}
                          className="px-3 py-1 text-sm text-white bg-gray-700 rounded-md"
                        >
                          <option value="">Assign Role</option>
                          <option value="Instructor">Instructor</option>
                          <option value="Senior_Faculty">Senior Faculty</option>
                          <option value="Program_Chair">Program Chair</option>
                          <option value="CITL">CITL</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => approveAccount(account._id, account.role)}
                          disabled={!account.role}
                          className="px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          onClick={() => declineAccount(account._id)}
                          style={{ marginLeft: "10px" }}
                          className="px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                          <FaTimes /> Decline
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-sm text-center text-gray-800">No pending accounts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApproval;
