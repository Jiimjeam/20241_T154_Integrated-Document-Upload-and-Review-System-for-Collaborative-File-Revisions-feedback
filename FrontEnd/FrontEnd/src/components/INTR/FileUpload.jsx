import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [subjectCode, setSubjectCode] = useState('');
  const [author, setAuthor] = useState('');
  const [coAuthor, setCoAuthor] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const API_URL = 'http://localhost:5000/api/upload';

  useEffect(() => {
    fetchUploadedFiles();
    fetchUsers();
  }, []);

  const fetchUploadedFiles = async () => {
    setLoadingFiles(true);
    try {
      const response = await axios.get(`${API_URL}/`);
      setUploadedFiles(response.data.files);
    } catch (error) {
      console.error('Error fetching files:', error);
      setMessage('Error fetching uploaded files.');
    } finally {
      setLoadingFiles(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Error fetching users.');
    } finally {
      setLoadingUsers(false);
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
      await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('File uploaded successfully!');
      fetchUploadedFiles();
      setFile(null);
      setSubjectCode('');
      setAuthor('');
      setCoAuthor('');
    } catch (error) {
      setMessage('Error uploading file');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await axios.delete(`${API_URL}/${fileId}`);
      fetchUploadedFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      setMessage('Error deleting file.');
    }
  };

  const handleSendFile = async (fileId) => {
    if (!selectedUser) {
      setMessage('Please select a user to send the file to!');
      return;
    }

    try {
      await axios.post(`${API_URL}/send-file`, {
        fileId,
        userId: selectedUser,
      });

      setMessage('File sent successfully!');
    } catch (error) {
      setMessage('Error sending file');
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">File Management</h1>

      <div className="mb-3">
        <label className="form-label">Subject Code:</label>
        <input
          type="text"
          className="form-control"
          value={subjectCode}
          onChange={(e) => setSubjectCode(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Author:</label>
        <input
          type="text"
          className="form-control"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Co-Author:</label>
        <input
          type="text"
          className="form-control"
          value={coAuthor}
          onChange={(e) => setCoAuthor(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">File:</label>
        <input type="file" className="form-control" onChange={handleFileChange} />
      </div>
      <button
        className="btn btn-primary"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
      {message && <div className="alert alert-info mt-3">{message}</div>}

      <h2 className="mt-5">Uploaded Files</h2>
      {loadingFiles ? (
        <p>Loading files...</p>
      ) : uploadedFiles.length > 0 ? (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Author</th>
              <th>Co-Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file) => (
              <tr key={file._id}>
                <td>{file.subjectCode}</td>
                <td>{file.author}</td>
                <td>{file.coAuthor || 'N/A'}</td>
                <td>
                  <select
                    className="form-select mb-2"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">Select User</option>
                    {loadingUsers ? (
                      <option value="">Loading users...</option>
                    ) : (
                      users.length > 0 ? (
                        users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name}
                          </option>
                        ))
                      ) : (
                        <option value="">No users available</option>
                      )
                    )}
                  </select>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleSendFile(file._id)}
                  >
                    Send
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(file._id)}
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
    </div>
  );
};

export default FileUpload;
