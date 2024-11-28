import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTable } from "react-table"; // Import react-table hooks

const ExistingUsers = () => {
  const [approvedAccounts, setApprovedAccounts] = useState([]); // State to hold approved users
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch approved accounts from the backend
  const fetchApprovedAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/auth/users");
      if (response.status === 200) {
        setApprovedAccounts(response.data); // Set approved users data
      } else {
        setError("No approved accounts found.");
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch approved accounts.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedAccounts();
  }, []);

  // Define table columns
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name", // key in the data
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "role",
      },
    ],
    []
  );

  // Create the table instance using react-table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: approvedAccounts,
  });

  return (
    <div>
      <h1>Approved Accounts</h1>
      {loading ? (
        <p>Loading approved accounts...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table {...getTableProps()} border="1">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExistingUsers;
