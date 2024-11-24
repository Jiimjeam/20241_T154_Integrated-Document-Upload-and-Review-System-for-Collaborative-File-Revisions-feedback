import File from '../model/File.js';
import { User } from "../model/User.js";
import cloudinary from '../db/cloudinary.config.js';

export const uploadFile = async (req, res) => {
  try {
    // Validate uploaded file
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract and validate body fields
    const { subjectCode, author, coAuthor } = req.body;
    if (!subjectCode || !author) {
      return res.status(400).json({ message: 'Subject Code and Author are required!' });
    }

    // Extract authenticated user's ID from middleware
    const uploaderUserId = req.userId;
    if (!uploaderUserId) {
      return res.status(401).json({ message: 'Unauthorized: No valid user found' });
    }

    // Determine resource type based on MIME type
    const mimeType = req.file.mimetype;
    const resourceTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif'],
      video: ['video/mp4', 'video/mkv', 'video/avi'],
      raw: [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
    };

    let resourceType = null;
    for (const [key, types] of Object.entries(resourceTypes)) {
      if (types.includes(mimeType)) {
        resourceType = key;
        break;
      }
    }

    if (!resourceType) {
      return res.status(400).json({ message: 'Unsupported file type' });
    }

    // Upload file to Cloudinary
    const cloudinaryUploadOptions = {
      folder: 'T_154_Files',
      resource_type: resourceType,
    };
    const result = await cloudinary.uploader.upload(req.file.path, cloudinaryUploadOptions);

    // Save file metadata to MongoDB
    const fileData = {
      filename: result.original_filename,
      filepath: result.secure_url,
      size: req.file.size,
      mimetype: mimeType,
      subjectCode,
      author,
      coAuthor,
      uploaderUserId,
    };

    const file = new File(fileData);
    await file.save();

    // Respond with success
    return res.status(201).json({
      message: 'File uploaded successfully',
      file,
    });
  } catch (error) {
    console.error('Error during file upload:', error.message);
    return res.status(500).json({
      message: 'Error uploading file',
      error: error.message,
    });
  }
};

// Fetch all uploaded files
export const getUploadedFiles = async (req, res) => {
  try {
    const files = await File.find(); // Fetch all files from the database
    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files', error: error.message });
  }
};

// Delete a file by ID
export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const publicId = file.filepath.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`T_154_Files/${publicId}`, { resource_type: 'raw' });

    await File.findByIdAndDelete(id);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
};

export const sendFile = async (req, res) => {
  const { fileId, userId } = req.body;

  if (!fileId || !userId) {
    return res.status(400).json({ message: 'File ID and User ID are required' });
  }

  try {
    // Find the file by ID
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Find the user to send the file to
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming file ownership or access can be transferred
    file.recipientUserId = userId;  // Add recipient user ID to file
    await file.save();  // Save the updated file data

    res.status(200).json({ message: 'File sent successfully!' });
  } catch (error) {
    console.error('Error sending file:', error);
    res.status(500).json({ message: 'Error sending file' });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name _id'); // Fetch only the necessary fields (_id and name)
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};
