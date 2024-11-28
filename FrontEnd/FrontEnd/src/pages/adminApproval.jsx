import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminApproval = () => {
  const [noPendingAccounts, setNoPendingAccounts] = useState(false);  // New state for tracking no accounts
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending accounts from the backend
  const fetchPendingAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/auth/admin/get/pending-accounts");

      console.log("Fetched Pending Accounts:", response.data); // Check API response in console

      if (response.status === 404 && response.data.message === "No pending accounts found") {
        setNoPendingAccounts(true); // No pending accounts found
        setPendingAccounts([]); // Clear any previous data
        setError(null); // Clear any previous errors
      } else if (response.status === 200) {
        setPendingAccounts(response.data); // Set pending accounts from response
        setNoPendingAccounts(false); // There are pending accounts
        setError(null); // Clear any previous errors
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching accounts:", err); // Log full error in console
      setError("No pending accounts"); // Actual error message
      setNoPendingAccounts(false); // Ensure noPendingAccounts state is false
      setLoading(false);
    }
  };

  // Handle account approval and role assignment
  const approveAccount = async (userId, role) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/auth/admin/approve-user/${userId}`, { status: "Approved", role });
      console.log("Account approved:", response.data); // Check approval response in console
      fetchPendingAccounts(); // Refresh pending accounts list after approval
    } catch (err) {
      console.error("Error approving account:", err); // Log full error in console
      setError("Failed to approve account");
    }
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
    <div>
      <h1>Pending Accounts</h1>
      {loading ? (
        <p>Loading pending accounts...</p>
      ) : error ? (
        <p>{error}</p> // Show error if there is an actual issue with fetching
      ) : noPendingAccounts ? (
        <p>No pending accounts found.</p> // Show if there are no pending accounts
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingAccounts.map((account) => (
                <tr key={account._id}>
                  <td>{account.name}</td>
                  <td>{account.email}</td>
                  <td>
                    <select
                      value={account.role || ""}
                      onChange={(e) => handleRoleChange(e, account._id)}
                    >
                      <option value="">Assign Role</option>
                      <option value="Instructor">Instructor</option>
                      <option value="Admin">Admin</option>
                      <option value="Program_Chair">Program Chair</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => approveAccount(account._id, account.role)}
                      disabled={!account.role}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminApproval;
