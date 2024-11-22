import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// Utility functions for API calls
const fetchFiles = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/files');
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
  const [fileType, setFileType] = useState(null);
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [revisionComment, setRevisionComment] = useState('');

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
  }, []);

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

  const handleRevise = (fileId) => {
    setSelectedFileId(fileId);
    setShowRevisionModal(true); // Show the revision comment modal
  };

  const handleReviseSubmit = async () => {
    if (!revisionComment) return;

    try {
      const response = await reviseFile(selectedFileId, revisionComment);
      toast.info(`File "${response.file.filename}" marked for revision.`);
      setFiles((prev) =>
        prev.map((file) =>
          file._id === selectedFileId ? { ...file, status: 'revision', reviewed: true } : file
        )
      );
      setShowRevisionModal(false); // Close modal after submitting
      setRevisionComment(''); // Clear the comment input
    } catch (error) {
      toast.error('Error revising file.');
    }
  };

  const handleViewFile = (filepath) => {
    setSelectedFile(filepath);
    const fileExtension = filepath.split('.').pop().toLowerCase();
    setFileType(fileExtension);
    setShowFilePreviewModal(true); // Show the preview modal
  };

  const downloadFile = async (filepath) => {
    try {
      if (filepath.startsWith('http://') || filepath.startsWith('https://')) {
        window.open(filepath, '_blank');
        toast.success('File download initiated.');
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/files/download/${encodeURIComponent(filepath)}`,
        { responseType: 'blob' }
      );

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
      console.error('Error downloading file:', error.message);
      toast.error('Error downloading file.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="row">
        <div className="col-md-12">
          <table className="table table-striped table-bordered table-hover">
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
                        className="btn btn-success btn-sm mx-1"
                      >
                        <i className="bi bi-check2-circle"></i> Approve
                      </button>
                    )}
                    {file.status !== 'revision' && !file.reviewed && (
                      <button
                        onClick={() => handleRevise(file._id)}
                        className="btn btn-warning btn-sm mx-1"
                      >
                        <i className="bi bi-pencil-square"></i> Revise
                      </button>
                    )}
                    <button
                      onClick={() => handleViewFile(file.filepath)}
                      className="btn btn-info btn-sm mx-1"
                    >
                      <i className="bi bi-eye"></i> View
                    </button>
                    <button
                      onClick={() => downloadFile(file.filepath)}
                      className="btn btn-primary btn-sm mx-1"
                    >
                      <i className="bi bi-download"></i> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* File Preview Modal */}
      <div
        className={`modal fade ${showFilePreviewModal ? 'show' : ''}`}
        id="filePreviewModal"
        tabIndex="-1"
        aria-labelledby="filePreviewModalLabel"
        aria-hidden="true"
        style={{ display: showFilePreviewModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="filePreviewModalLabel">File Preview</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowFilePreviewModal(false)}
              ></button>
            </div>
            <div className="modal-body">
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
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowFilePreviewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Revision Comment Modal */}
      <div
        className={`modal fade ${showRevisionModal ? 'show' : ''}`}
        id="revisionModal"
        tabIndex="-1"
        aria-labelledby="revisionModalLabel"
        aria-hidden="true"
        style={{ display: showRevisionModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="revisionModalLabel">Enter Revision Comment</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowRevisionModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                value={revisionComment}
                onChange={(e) => setRevisionComment(e.target.value)}
                placeholder="Enter your comment"
                rows="5"
              ></textarea>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowRevisionModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleReviseSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorFacultyDashboard;
