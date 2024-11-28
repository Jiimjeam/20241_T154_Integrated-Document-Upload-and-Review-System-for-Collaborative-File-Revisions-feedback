import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const fetchFiles = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/files/approved', {
      params: { status: 'approved' }, // Filter for approved files
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching approved files.');
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
    toast.error('Error downloading file.');
  }
};

const ProgramChairDashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [revisionComment, setRevisionComment] = useState('');

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const fetchedFiles = await fetchFiles(); // Fetch only approved files
        setFiles(fetchedFiles);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching approved files.');
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
      setShowFilePreviewModal(false); // Close modal after submitting
      setRevisionComment(''); // Clear the comment input
    } catch (error) {
      toast.error('Error revising file.');
    }
  };

  const handleViewFile = (fileId, filepath) => {
    setSelectedFile(filepath);
    setSelectedFileId(fileId);
    const fileExtension = filepath.split('.').pop().toLowerCase();
    setFileType(fileExtension);
    setShowFilePreviewModal(true); // Show the preview modal
  };

  if (loading) return <div>Loading...</div>;

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success text-white';
      case 'revision':
        return 'bg-warning text-dark';
      case 'pending':
      default:
        return 'bg-secondary text-white';
    }
  };

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
                  <td>
                    <span className={`badge ${getStatusClass(file.status || 'pending')}`}>
                      {file.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleViewFile(file._id, file.filepath)}
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

      {/* File Preview and Revise Modal */}
      {selectedFile && (
        <div
          className={`modal fade ${showFilePreviewModal ? 'show' : ''}`}
          style={{ display: showFilePreviewModal ? 'block' : 'none' }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">File Preview and Actions</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowFilePreviewModal(false)}
                ></button>
              </div>
              <div className="modal-body d-flex">
                {/* File Preview Section */}
                <div className="file-preview flex-grow-1" style={{ marginRight: '1rem' }}>
                  {fileType === 'pdf' ? (
                    <iframe
                      src={selectedFile}
                      title="PDF Preview"
                      style={{ width: '100%', height: '500px', border: 'none' }}
                    ></iframe>
                  ) : fileType === 'docx' || fileType === 'doc' ? (
                    <iframe
                      src={`https://docs.google.com/gview?url=${selectedFile}&embedded=true`}
                      title="Word Document Preview"
                      style={{ width: '100%', height: '500px', border: 'none' }}
                    ></iframe>
                  ) : (
                    <p className="text-muted">File preview not available for this type.</p>
                  )}
                </div>

                {/* Revision and Approve Section */}
                <div className="actions-section" style={{ width: '30%' }}>
                  {/* Revision Comments Section */}
                  <h6>Revision Comments</h6>
                  <textarea
                    className="form-control"
                    value={revisionComment}
                    onChange={(e) => setRevisionComment(e.target.value)}
                    placeholder="Add your comments here"
                    rows="10"
                  ></textarea>
                  <button
                    className="btn btn-warning mt-3 w-100"
                    onClick={handleReviseSubmit}
                    disabled={!revisionComment}
                  >
                    Submit Revision
                  </button>
                  <button
                    className="btn btn-success mt-3 w-100"
                    onClick={() => {
                      handleApprove(selectedFileId);
                      setShowFilePreviewModal(false); // Close modal after approving
                    }}
                  >
                    Approve File
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowFilePreviewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramChairDashboard;
