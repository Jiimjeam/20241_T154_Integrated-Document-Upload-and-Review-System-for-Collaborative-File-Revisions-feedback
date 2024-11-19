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
  const [users, setUsers] = useState([]); // Users fetched from the database
  const [selectedUser, setSelectedUser] = useState(''); // Selected user for file sending
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const API_URL = 'http://localhost:5000/api/upload'; // Backend URL

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
      setUsers(response.data.users); // Assuming the API returns an array of users
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
      // Optional: Validate file type (e.g., only allow PDF or DOCX)
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
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('File uploaded successfully!');
      fetchUploadedFiles(); // Refresh file list
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
      fetchUploadedFiles(); // Refresh file list
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
      const response = await axios.post(`${API_URL}/send-file`, {
        fileId,
        userId: selectedUser, // selectedUser will be the recipient's user ID
      });

      setMessage('File sent successfully!');
      console.log(response.data);
    } catch (error) {
      setMessage('Error sending file');
      console.error(error);
    }
  };

  return (
    <div className="file-upload">
      <h1>File Management</h1>
      <div>
        <label>Subject Code:</label>
        <input
          type="text"
          value={subjectCode}
          onChange={(e) => setSubjectCode(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Author:</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Co-Author:</label>
        <input
          type="text"
          value={coAuthor}
          onChange={(e) => setCoAuthor(e.target.value)}
        />
      </div>
      <div>
        <label>File:</label>
        <input type="file" onChange={handleFileChange} />
      </div>
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
      {message && <p>{message}</p>}

      <h2>Uploaded Files</h2>
      {loadingFiles ? (
        <p>Loading files...</p>
      ) : uploadedFiles.length > 0 ? (
        <table className="uploaded-files-table">
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

                  <button onClick={() => handleSendFile(file._id)}>
                    Send
                  </button>
                  <button onClick={() => handleDelete(file._id)}>Delete</button>
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
