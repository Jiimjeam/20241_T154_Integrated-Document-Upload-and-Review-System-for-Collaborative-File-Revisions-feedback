import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/files/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Action History</h2>
      {history.length > 0 ? (
        <ul className="list-group">
          {history.map((entry, index) => (
            <li key={index} className="list-group-item">
              <strong>Action:</strong> {entry.action} <br />
              <strong>File:</strong> {entry.fileId?.subjectCode || 'Unknown'} <br />
              <strong>Author:</strong> {entry.fileId?.author || 'Unknown'} <br />
              <strong>Timestamp:</strong> {new Date(entry.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No history available.</p>
      )}
    </div>
  );
};

export default History;
