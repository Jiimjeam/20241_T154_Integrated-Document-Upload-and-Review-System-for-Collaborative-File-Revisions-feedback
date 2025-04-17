import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';

const Profileupload = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load existing image from server on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/user/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // if you're using JWT
      }
    })
    .then(res => {
      if (res.data.profileImageUrl) {
        setProfileImage(res.data.profileImageUrl);
      }
    })
    .catch(err => {
      console.error('Error fetching profile image:', err);
    });
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert("Please upload a valid image file.");
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      setLoading(true);  // Show loading state while uploading
      const res = await axios.post('http://localhost:5000/api/user/profile-image', formData, {

        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,  // Make sure token is correctly set in localStorage
        },
      });
      

      setProfileImage(res.data.profileImageUrl); // Update preview
      setLoading(false); // Hide loading state
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Image upload failed');
      setLoading(false); // Hide loading state in case of failure
    }
  };

  const handleImageUpload = () => {
    document.getElementById('profileFileInput').click();
  };

  return (
    <div className="profile">
      <div
        className="profileImage"
        onClick={handleImageUpload}
        style={{
          backgroundImage: profileImage ? `url(${profileImage})` : 'none',
        }}
      >
        {!profileImage && !loading && <span>Upload</span>}
        {loading && <span>Uploading...</span>} {/* Show loading indicator */}
      </div>
      <input
        id="profileFileInput"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default Profileupload;
