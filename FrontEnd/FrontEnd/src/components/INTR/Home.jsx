import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; // Import the corresponding CSS for styling
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api'; // Adjust API URL as necessary

const Home = () => {
  // State variables for file counts
  const [approvedFiles, setApprovedFiles] = useState(0);
  const [pendingFiles, setPendingFiles] = useState(0);
  const [revisionsRequired, setRevisionsRequired] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch file counts
    const fetchFileCounts = async () => {
      try {
        const response = await axios.get(`${API_URL}/files/stats`);
        const { approved, pending, revision } = response.data;

        setApprovedFiles(approved || 0);
        setPendingFiles(pending || 0);
        setRevisionsRequired(revision || 0);

        toast.success('Dashboard data fetched successfully!');
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchFileCounts();
  }, []);

  if (loading) {
    return <p>Loading dashboard data...</p>;
  }

  return (
    <div className="home-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>
      <div className="card-deck">
        {/* Approved Files Card */}
        <div className="card">
          <div className="card-body text-center">
            <h5 className="card-title text-success">Approved Files</h5>
            <p className="card-text display-4">{approvedFiles}</p>
            <p className="card-text">Files that have been approved and processed.</p>
          </div>
        </div>

        {/* Pending Files Card */}
        <div className="card">
          <div className="card-body text-center">
            <h5 className="card-title text-warning">Pending Files</h5>
            <p className="card-text display-4">{pendingFiles}</p>
            <p className="card-text">Files awaiting approval or processing.</p>
          </div>
        </div>

        {/* Files Requiring Revisions Card */}
        <div className="card">
          <div className="card-body text-center">
            <h5 className="card-title text-danger">Revisions Required</h5>
            <p className="card-text display-4">{revisionsRequired}</p>
            <p className="card-text">Files that need revisions before approval.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
