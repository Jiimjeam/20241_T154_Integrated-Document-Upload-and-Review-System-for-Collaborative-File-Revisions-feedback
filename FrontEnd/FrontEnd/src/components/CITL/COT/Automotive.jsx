import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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

const Automotive = ({ show, handleClose }) => {
  const [approvedFiles, setApprovedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [revisionComment, setRevisionComment] = useState('');
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);

  const fetchApprovedFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/files/automotive', {
        params: { department: 'BSAT' },
      });
      setApprovedFiles(response.data.files || []);
    } catch (error) {
      console.error('Error fetching approved files:', error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || 'Failed to fetch approved files. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedFiles();
  }, []);

  const handleApprove = async (fileId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/files/${fileId}/ready-to-print`);
      toast.success(`File "${response.data.file.filename}" approved successfully.`);
      setApprovedFiles((prev) =>
        prev.map((file) =>
          file._id === fileId ? { ...file, status: 'ready to print', reviewed: true } : file
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
      setApprovedFiles((prev) =>
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

  return (
    <>
      <ToastContainer />
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>CITL Dashboard - BSAT Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div>Loading files...</div>
          ) : approvedFiles.length === 0 ? (
            <div>No files available for review.</div>
          ) : (
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
                {approvedFiles.map((file) => (
                  <tr key={file._id} className={file.reviewed ? 'table-success' : ''}>
                    <td>{file.filename}</td>
                    <td>{file.subjectCode}</td>
                    <td>{file.author}</td>
                    <td>{file.status || 'Pending'}</td>
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
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* File Preview and Revise Modal */}
      {selectedFile && (
        <Modal show={showFilePreviewModal} onHide={() => setShowFilePreviewModal(false)} size="xl" centered>
          <Modal.Header closeButton>
            <Modal.Title>File Preview and Actions</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex">
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
                  setShowFilePreviewModal(false);
                }}
              >
                Ready to print
              </button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFilePreviewModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Automotive;
