import React, { useState } from 'react';
import './adminProfile.css';

const Profileupload = () => {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Check if the file is an image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleImageUpload = () => {
    document.getElementById('profileFileInput').click(); // Opens file input for profile image
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
        {!profileImage && <span>Upload</span>}
      </div>
      <input
        id="profileFileInput"
        type="file"
        accept="image/*" // Only allows image files
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default Profileupload;
