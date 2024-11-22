import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { Modal } from 'react-bootstrap'; // Import Modal from react-bootstrap

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [subjectCode, setSubjectCode] = useState('');
  const [author, setAuthor] = useState('');
  const [coAuthor, setCoAuthor] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control file upload modal visibility
  const [previewModalShow, setPreviewModalShow] = useState(false); // State to control preview modal visibility
  const previewRef = useRef(null);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchUploadedFiles();
    toast.info('Welcome to the File Management Dashboard!');
  }, []);

  const fetchUploadedFiles = async () => {
    setLoadingFiles(true);
    try {
      const response = await axios.get(`${API_URL}/files`);
      setUploadedFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      setMessage('Error fetching uploaded files.');
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage('Invalid file type. Only PDF and DOCX files are allowed.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !subjectCode || !author) {
      setMessage('Please fill all required fields and select a file!');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subjectCode', subjectCode);
    formData.append('author', author);
    formData.append('coAuthor', coAuthor);

    try {
      const response = await axios.post(`${API_URL}/upload/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedFile = response.data;
      setMessage('File uploaded successfully!');
      toast.success('File uploaded successfully!');
      fetchUploadedFiles();

      setFile(null);
      setSubjectCode('');
      setAuthor('');
      setCoAuthor('');
      setShowModal(false); // Close modal after upload
    } catch (error) {
      setMessage('Error uploading file');
      toast.error('Error uploading file!');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleViewFile = (filepath) => {
    setSelectedFile(filepath);
    const fileExtension = filepath.split('.').pop().toLowerCase();
    setFileType(fileExtension);
    setPreviewModalShow(true); // Show the preview modal
  };

  const closePreview = () => {
    setPreviewModalShow(false); // Close the preview modal
    setSelectedFile(null);
    setFileType(null);
  };

  const downloadFile = async (filepath) => {
    try {
      if (filepath.startsWith('http://') || filepath.startsWith('https://')) {
        window.open(filepath, '_blank');
        toast.success('File download initiated.');
        return;
      }

      const response = await axios.get(`${API_URL}/files/download/${encodeURIComponent(filepath)}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = filepath.split('/').pop();
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

  const handleDelete = (fileId) => {
    const fileToDelete = uploadedFiles.find((file) => file._id === fileId);
    if (!window.confirm(`Are you sure you want to delete the file "${fileToDelete?.subjectCode}" from the dashboard only?`)) {
      toast.info('Delete action cancelled.');
      return;
    }

    setUploadedFiles(uploadedFiles.filter((file) => file._id !== fileId));
    setHistory([...history, { action: 'Deleted file from dashboard', fileId, timestamp: new Date().toLocaleString() }]);
    toast.success(`File "${fileToDelete?.subjectCode}" deleted from the dashboard.`);
  };

  return (
    <div className="container mt-4">
      <h1> Add File </h1>
      
      {/* Button to trigger modal */}
      <button onClick={() => setShowModal(true)} className="btn btn-primary mb-3">Upload File</button>

      {/* Modal for file upload */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="file-upload">
            <div className="mb-3">
              <label>Subject Code:</label>
              <input
                type="text"
                className="form-control"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Author:</label>
              <input
                type="text"
                className="form-control"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Co-Author:</label>
              <input
                type="text"
                className="form-control"
                value={coAuthor}
                onChange={(e) => setCoAuthor(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>File:</label>
              <input type="file" className="form-control" onChange={handleFileChange} />
            </div>
            <button onClick={handleUpload} disabled={uploading} className="btn btn-primary">
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
            {message && <p>{message}</p>}
          </div>
        </Modal.Body>
      </Modal>

      <h2 className="mt-4">Uploaded Files</h2>
      {loadingFiles ? (
        <p>Loading files...</p>
      ) : uploadedFiles.length > 0 ? (
        <table className="table table-striped table-responsive uploaded-files-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Author</th>
              <th>Co-Author</th>
              <th>Status</th>
              <th>Revision Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file) => (
              <tr key={file._id}>
                <td>{file.subjectCode}</td>
                <td>{file.author}</td>
                <td>{file.coAuthor || 'N/A'}</td>
                <td>{file.status || 'Pending'}</td>
                <td>{file.status === 'revision' ? file.revisionComment : 'N/A'}</td>
                <td>
                  <button onClick={() => handleViewFile(file.filepath)} className="btn btn-info btn-sm mx-1">View</button>
                  <button onClick={() => downloadFile(file.filepath)} className="btn btn-success btn-sm mx-2">Download</button>
                  <button onClick={() => handleDelete(file._id)} className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No files uploaded yet.</p>
      )}

      <h2 className="mt-4">Action History</h2>
      <ul className="list-group">
        {history.map((entry, index) => (
          <li key={index} className="list-group-item">
            {entry.timestamp} - {entry.action}
          </li>
        ))}
      </ul>

      {/* File Preview Modal */}
      <Modal show={previewModalShow} onHide={closePreview} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>File Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* PDF Preview */}
          {fileType === 'pdf' ? (
            <iframe
              src={`${API_URL}/files/preview/${encodeURIComponent(selectedFile)}`}
              title="PDF Preview"
              style={{ width: '100%', height: '400px', border: 'none' }}
            ></iframe>
          ) : fileType === 'docx' || fileType === 'doc' ? (
            <iframe
              src={`https://docs.google.com/gview?url=${selectedFile}&embedded=true`}
              title="Word Document Preview"
              style={{ width: '100%', height: '400px', border: 'none' }}
            ></iframe>
          ) : (
            <p>File preview not available for this type.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FileUpload;
