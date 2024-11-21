import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// Utility functions for API calls
const fetchFiles = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/files'); // Update with your API URL
    return response.data;
  } catch (error) {
    throw new Error('Error fetching files.');
  }
};

const approveFile = async (fileId) => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/api/files/${fileId}/approve`
    );
    return response.data;
  } catch (error) {
    throw new Error('Error approving file.');
  }
};

const reviseFile = async (fileId, comment) => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/api/files/${fileId}/revise`,
      { comment }
    );
    return response.data;
  } catch (error) {
    throw new Error('Error revising file.');
  }
};

const SeniorFacultyDashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null); // Track file type for preview

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const fetchedFiles = await fetchFiles();
        setFiles(fetchedFiles);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching files.');
        setLoading(false);
      }
    };

    loadFiles();
  }, []); // Fetch the files on component mount

  const handleApprove = async (fileId) => {
    try {
      const response = await approveFile(fileId);
      toast.success(`File "${response.file.filename}" approved successfully.`);
      setFiles((prev) =>
        prev.map((file) =>
          file._id === fileId ? { ...file, status: 'approved', reviewed: true } : file
        )
      );
    } catch (error) {
      toast.error('Error approving file.');
    }
  };

  const handleRevise = async (fileId) => {
    const comment = prompt('Enter a comment for revision:');
    if (!comment) return;

    try {
      const response = await reviseFile(fileId, comment);
      toast.info(`File "${response.file.filename}" marked for revision.`);
      setFiles((prev) =>
        prev.map((file) =>
          file._id === fileId ? { ...file, status: 'revision', reviewed: true } : file
        )
      );
    } catch (error) {
      toast.error('Error revising file.');
    }
  };

  const handleViewFile = (filepath) => {
    setSelectedFile(filepath);
    const fileExtension = filepath.split('.').pop().toLowerCase();
    setFileType(fileExtension); // Set the file type based on the extension
  };

  const downloadFile = async (filepath) => {
    try {
      // Check if the filepath is an external URL
      if (filepath.startsWith('http://') || filepath.startsWith('https://')) {
        window.open(filepath, '_blank');
        toast.success('File download initiated.');
        return;
      }

      // If it's a local path, proceed with downloading from the server
      const response = await axios.get(
        `http://localhost:5000/api/files/download/${encodeURIComponent(filepath)}`,
        { responseType: 'blob' } // Ensure the file is downloaded as binary
      );
      

      // Create a URL for the file blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Extract the filename from the response headers or use a fallback
      const disposition = response.headers['content-disposition'];
      const filename = disposition
        ? disposition.split('filename=')[1].replace(/"/g, '')
        : filepath.split('/').pop(); // Fallback to the file's base name

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`File "${filename}" downloaded successfully.`);

    } catch (error) {
      console.error('Error downloading file:', error.message);
      toast.error('Error downloading file.');
    }
  };
  

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <ToastContainer /> {/* Toast notifications */}
      <h1 className="mb-4 text-center">Senior Faculty Dashboard</h1>
      <div className="row">
        {/* Table Section */}
        <div className="col-md-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Uploaded Files</h3>
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Filename</th>
                    <th>Subject Code</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
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
                        <button
                          onClick={() => handleViewFile(file.filepath)}
                          className="btn btn-info btn-sm mx-1"
                        >
                          View
                        </button>
                        <button
                        onClick={() => downloadFile(file.filepath)} // Pass filepath to the download function
                            className="btn btn-primary btn-sm ml-2"
                         >
                            Download
                          </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* File Preview Section */}
        <div className="col-md-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="card-title">File Preview</h3>
              {selectedFile ? (
                fileType === 'pdf' ? (
                  <iframe
                    src={selectedFile}
                    title="PDF Preview"
                    style={{ width: '100%', height: '450px', border: 'none' }}
                  ></iframe>
                ) : fileType === 'docx' || fileType === 'doc' ? (
                  <iframe
                    src={`https://docs.google.com/gview?url=${selectedFile}&embedded=true`}
                    title="Word Document Preview"
                    style={{ width: '100%', height: '450px', border: 'none' }}
                  ></iframe>
                ) : (
                  <p className="text-muted">File preview not available for this type.</p>
                )
              ) : (
                <p className="text-muted">Select a file to preview.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorFacultyDashboard;
