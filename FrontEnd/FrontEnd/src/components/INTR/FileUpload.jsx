import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [subjectCode, setSubjectCode] = useState('');
  const [author, setAuthor] = useState('');
  const [coAuthor, setCoAuthor] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [history, setHistory] = useState([]); // For tracking history
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected file to preview
  const [fileType, setFileType] = useState(null); // State for the file type (pdf, docx, etc.)
  const previewRef = useRef(null); // Reference to the file preview section

  const API_URL = 'http://localhost:5000/api'; // Backend URL

  useEffect(() => {
    fetchUploadedFiles();
    toast.info('Welcome to the File Management Dashboard!');
  }, []);

  const fetchUploadedFiles = async () => {
    setLoadingFiles(true);
    try {
      const response = await axios.get(`${API_URL}/files`);
      setUploadedFiles(response.data); // Assuming response contains the list of uploaded files
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
    setTimeout(() => previewRef.current?.scrollIntoView({ behavior: 'smooth' }), 300); // Scroll to preview section
  };

  const closePreview = () => {
    setSelectedFile(null);
    setFileType(null);
  };

 // Handle file download
const downloadFile = async (filepath) => {
  try {
    if (filepath.startsWith('http://') || filepath.startsWith('https://')) {
      window.open(filepath, '_blank');
      toast.success('File download initiated.');
      return;
    }

    const response = await axios.get(
      `${API_URL}/files/download/${encodeURIComponent(filepath)}`,
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

// Handle file delete
const handleDelete = (fileId) => {
  const fileToDelete = uploadedFiles.find((file) => file._id === fileId);

  if (!window.confirm(`Are you sure you want to delete the file "${fileToDelete?.subjectCode}" from the dashboard only?`)) {
    toast.info('Delete action cancelled.');
    return;
  }

  // Remove file from the UI without affecting the database
  setUploadedFiles(uploadedFiles.filter((file) => file._id !== fileId));

  // Add action to history
  setHistory([...history, { action: 'Deleted file from dashboard', fileId, timestamp: new Date().toLocaleString() }]);

  toast.success(`File "${fileToDelete?.subjectCode}" deleted from the dashboard.`);
};


  return (
    <div className="container mt-4">
      <h1>File Management</h1>
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

      <h2 className="mt-4">Uploaded Files</h2>
      {loadingFiles ? (
        <p>Loading files...</p>
      ) : uploadedFiles.length > 0 ? (
        <table className="table table-striped">
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
                  <button
                    onClick={() => handleViewFile(file.filepath)}
                    className="btn btn-info btn-sm mx-1"
                  >
                    View
                  </button>

                  <button
                    onClick={() => downloadFile(file.filepath)}
                    className="btn btn-success btn-sm mx-2"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No files uploaded yet.</p>
      )}

      <h2 className="mt-4">Action History</h2>
      {history.length > 0 ? (
        <ul className="list-group">
          {history.map((item, index) => (
            <li key={index} className="list-group-item">
              {item.timestamp} - {item.action} (File ID: {item.fileId})
            </li>
          ))}
        </ul>
      ) : (
        <p>No actions recorded yet.</p>
      )}

      {/* File Preview Section */}
      {selectedFile && (
        <div className="mt-4" ref={previewRef}>
          <div className="card">
            <div className="card-body">
              <button
                onClick={closePreview}
                className="btn btn-danger btn-sm close-btn"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                X
              </button>
              <h3>File Preview</h3>
              {fileType === 'pdf' ? (
                <iframe
                  src={selectedFile}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
