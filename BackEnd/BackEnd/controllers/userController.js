import { v2 as cloudinary } from 'cloudinary'; // Make sure you're using v2
import { User } from '../model/User.js';
import multer from 'multer';
import streamifier from 'streamifier'; // ✨ Required for buffer uploads
// import cloudinary from '../db/cloudinary.config.js';

const storage = multer.memoryStorage();
export const upload = multer({ storage }).single('profileImage');

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary using stream
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'profile_images',
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);

    // Save image URL to MongoDB
    const user = await User.findByIdAndUpdate(
      req.userId, // Use req.userId instead of req.user._id
      { profileImageUrl: result.secure_url },
      { new: true }
    );

    res.status(200).json({ profileImageUrl: user.profileImageUrl });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

export const getProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.userId); // Use req.userId here as well
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ profileImageUrl: user.profileImageUrl || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile image' });
  }
};
