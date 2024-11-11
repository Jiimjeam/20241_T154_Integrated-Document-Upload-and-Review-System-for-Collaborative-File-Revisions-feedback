import React, { useState } from 'react';
import './uploadFile.css';

const FileUpload = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      setFiles(prevFiles => [...prevFiles, selectedFile]);
    } else {
      alert("Please upload a non-image file.");
    }
  };

  const handleFileUpload = () => {
    if (files.length === 0) {
      alert('Please select at least one file first!');
      return;
    } else {
      alert('Files successfully uploaded!');
      files.forEach(file => console.log(`Uploading file: ${file.name} (${file.size} bytes, ${file.type})`));
    }

    // Clears the uploadbox
    document.getElementById('fileInput').value = null;
  };

  const handleFileDelete = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleFileDownload = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="file-upload-container">
      <label htmlFor="fileInput" className="uploadBox">
        {files.length > 0 ? 'Add More Files' : 'Click or Drag a File Here'}
      </label>
      <input
        id="fileInput"
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button onClick={handleFileUpload} disabled={files.length === 0}>
        Upload
      </button>
      
      <div className="uploaded-files">
        {files.map((file, index) => (
          <div key={index} className="file-item">
            <span onClick={() => handleFileDownload(file)} className="file-name">
              {file.name}
            </span>
            <button onClick={() => handleFileDelete(index)} className="delete-button">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
