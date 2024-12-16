import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './history.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const History = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage.
        const response = await axios.get('http://localhost:5000/api/files', {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token for authentication.
          },
        });

        setActivities(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('Failed to load activities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivities = activities.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(activities.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <h2 className="text-primary">📁 Upload History</h2>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* No Uploads Alert */}
      {activities.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No recent uploads.
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover table-bordered mt-3 custom-table">
              <thead className="thead-dark">
                <tr>
                  <th>Filename</th>
                  <th>Subject Code</th>
                  <th>Author</th>
                  <th>Upload Date</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {currentActivities.map((activity) => (
                  <tr key={activity._id}>
                    <td>{activity.filename}</td>
                    <td>{activity.subjectCode}</td>
                    <td>{activity.author}</td>
                    <td>{new Date(activity.timestamp).toLocaleString()}</td>
                    <td>{activity.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default History;
