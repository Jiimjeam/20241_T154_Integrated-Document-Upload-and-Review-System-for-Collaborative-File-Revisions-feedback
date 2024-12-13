import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const fetchFiles = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/files/allApprovedFiles?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );
    const { files, pagination } = response.data;
    return { files, totalPages: Math.ceil(pagination.totalFiles / pagination.limit) };
  } catch (error) {
    console.error(error.message);
    throw new Error('Error fetching files by department.');
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
    const response = await axios.post(
      `http://localhost:5000/api/files/${fileId}/revise`,
      { comment }
    );
    return response.data;
  } catch (error) {
    console.error("Error revising file:", error.message);
    throw new Error("Error revising file.");
  }
};

const ProgramChairDashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [revisionComment, setRevisionComment] = useState('');
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const { files, totalPages } = await fetchFiles(currentPage);
        setFiles(files);
        setTotalPages(totalPages);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching files.');
        setLoading(false);
      }
    };

    loadFiles();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
      setShowFilePreviewModal(false);
      setRevisionComment('');
    } catch (error) {
      toast.error('Error revising file.');
    }
  };

  const handleViewFile = (fileId, filepath) => {
    setSelectedFile(filepath);
    setSelectedFileId(fileId);
    const fileExtension = filepath.split('.').pop().toLowerCase();
    setFileType(fileExtension);
    setShowFilePreviewModal(true);
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
      document.body.removeChild(link);

      toast.success(`File "${filename}" downloaded successfully.`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error downloading file.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="row">
        <div className="col-md-12">
          <table className="table table-striped table-bordered table-hover shadow-sm rounded">
            <thead className="table-dark">
              <tr>
                <th>Subject Code</th>
                <th>Co Author</th>
                <th>Author</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file._id} className={file.reviewed ? 'table-success' : ''}>
                  <td>{file.subjectCode}</td>
                  <td>{file.coAuthor}</td>
                  <td>{file.author}</td>
                  <td>
                    <span
                      className={`badge rounded-pill text-white ${
                        file.status === 'approved'
                          ? 'bg-success'
                          : file.status === 'revision'
                          ? 'bg-warning'
                          : 'bg-secondary'
                      }`}
                    >
                      {file.status
                        ? file.status.charAt(0).toUpperCase() + file.status.slice(1)
                        : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleViewFile(file._id, file.filepath)}
                      className="btn btn-info btn-sm mx-1"
                    >
                      View & Revise
                    </button>
                    <button
                      onClick={() => downloadFile(file.filepath)}
                      className="btn btn-primary btn-sm mx-1"
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

      {/* Pagination */}
      <div className="pagination mt-3">
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index + 1}
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