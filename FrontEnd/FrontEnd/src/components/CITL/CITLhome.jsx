import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CITLhome.css';
import { toast } from 'react-toastify';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api'; // Adjust API URL as necessary

const Home = () => {
  const [approvedFiles, setApprovedFiles] = useState(0);
  const [pendingFiles, setPendingFiles] = useState(0);
  const [revisionsRequired, setRevisionsRequired] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/files/stats`);
        const { approved, pending, revision, total } = response.data;

        setApprovedFiles(approved || 0);
        setPendingFiles(pending || 0);
        setRevisionsRequired(revision || 0);
        setTotalFiles(total || 0);

        toast.success('Dashboard data fetched successfully!');
      } catch (error) {
        console.error('Error fetching file stats:', error);
        toast.error('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchFileStats();
  }, []);

  if (loading) {
    return <p>Loading dashboard data...</p>;
  }

  // Calculate percentage of approved files
  const approvedPercentage = totalFiles > 0 ? ((approvedFiles / totalFiles) * 100).toFixed(2) : 0;

  // Bar chart data
  const chartData = {
    labels: ['Total Uploaded Files', 'Approved Files', 'Pending Files', 'Revisions Required'],
    datasets: [
      {
        label: 'File Count',
        data: [totalFiles, approvedFiles, pendingFiles, revisionsRequired],
        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
        borderColor: ['#0056b3', '#1e7e34', '#e0a800', '#c82333'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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

        {/* Revisions Required Card */}
        <div className="card">
          <div className="card-body text-center">
            <h5 className="card-title text-danger">Revisions Required</h5>
            <p className="card-text display-4">{revisionsRequired}</p>
            <p className="card-text">Files that need revisions before approval.</p>
          </div>
        </div>

        {/* Total Uploaded Files Card */}
        <div className="card">
          <div className="card-body text-center">
            <h5 className="card-title text-info">Total Uploaded Files</h5>
            <p className="card-text display-4">{totalFiles}</p>
            <p className="card-text">All files uploaded to the system.</p>
          </div>
        </div>

        {/* Approval Percentage Card */}
        <div className="card">
          <div className="card-body text-center">
            <h5 className="card-title text-primary">Approval Rate</h5>
            <p className="card-text display-4">{approvedPercentage}%</p>
            <p className="card-text">Percentage of approved files.</p>
          </div>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="card mt-4">
        <div className="card-header bg-dark text-white">
          <h5 className="card-title mb-0">File Uploads Summary</h5>
        </div>
        <div className="card-body">
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
