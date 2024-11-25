import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const IT_EMCFiles = () => {
  const [approvedFiles, setApprovedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const fetchApprovedFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/files/it-emc-files', {
        params: { department: 'Bachelor of Science in Information Technology & Bachelor of Science in EMC' },
      });
      // Filter only approved files
      const approvedFiles = response.data.files.filter(file => file.status === 'approved');
      setApprovedFiles(approvedFiles);  // Set only approved files in the state
    } catch (error) {
      console.error('Error fetching approved files:', error.response?.data || error.message);
      toast.error('Failed to fetch approved files. Please try again.');
    } finally {
      setLoading(false);  // Stop loading after fetching
    }
  };
  
  

  useEffect(() => {
    fetchApprovedFiles();
  }, []);

  // Handle file approval
  const handleApprove = async (fileId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/files/${fileId}/approve`);
      toast.success(`File "${response.data.file.filename}" approved successfully.`);
      setApprovedFiles((prev) =>
        prev.map((file) =>
          file._id === fileId ? { ...file, status: 'approved', reviewed: true } : file
        )
      );
    } catch (error) {
      toast.error('Error approving file.');
    }
  };

  // Handle file revision
  const handleRevise = async (fileId) => {
    const comment = prompt('Enter a comment for revision:');
    if (!comment) return;

    try {
      const response = await axios.patch(`http://localhost:5000/api/files/${fileId}/revise`, { comment });
      toast.info(`File "${response.data.file.filename}" marked for revision.`);
      setApprovedFiles((prev) =>
        prev.map((file) =>
          file._id === fileId ? { ...file, status: 'revision', reviewed: true } : file
        )
      );
    } catch (error) {
      toast.error('Error revising file.');
    }
  };

  // Handle file download
  const downloadFile = async (filepath) => {
    try {
      if (filepath.startsWith('http://') || filepath.startsWith('https://')) {
        window.open(filepath, '_blank');
        toast.success('File download initiated.');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/files/download/${encodeURIComponent(filepath)}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const disposition = response.headers['content-disposition'];
      const filename = disposition
        ? disposition.split('filename=')[1].replace(/"/g, '')
        : filepath.split('/').pop();

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`File "${filename}" downloaded successfully.`);
    } catch (error) {
      toast.error('Error downloading file.');
    }
  };

  // Handle forward action
  const handleForward = () => {
    setCurrentFileIndex((prevIndex) => Math.min(prevIndex + 1, approvedFiles.length - 1));
  };

  // Handle empty state
  if (loading) return <div>Loading...</div>;
  if (approvedFiles.length === 0) return <div>No files available for review.</div>;

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h1 className="mb-4">CITL Dashboard</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Subject Code</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {approvedFiles.map((file, index) => (
            <tr key={file._id} className={file.reviewed ? 'table-success' : ''}>
              <td>{file.filename}</td>
              <td>{file.subjectCode}</td>
              <td>{file.author}</td>
              <td>{file.status || 'Pending'}</td>
              <td>
                {file.status !== 'approved' && !file.reviewed && (
                  <button
                    onClick={() => handleApprove(file._id)}
                    className="btn btn-success btn-sm mr-2"
                  >
                    Approve
                  </button>
                )}
                {file.status !== 'revision' && !file.reviewed && (
                  <button
                    onClick={() => handleRevise(file._id)}
                    className="btn btn-warning btn-sm"
                  >
                    Revise
                  </button>
                )}
                {file.reviewed && <span className="badge bg-info">Checked</span>}
                <button
                  onClick={() => downloadFile(file.filepath)}
                  className="btn btn-primary btn-sm ml-2"
                >
                  Download
                </button>
                <button
                  onClick={handleForward}
                  className="btn btn-info btn-sm ml-2"
                  disabled={index !== currentFileIndex || currentFileIndex === approvedFiles.length - 1}
                >
                  Forward
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IT_EMCFiles;
