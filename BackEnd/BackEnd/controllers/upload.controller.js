// controllers/upload.controller.js
import File from '../model/File.js';
import cloudinary from '../db/cloudinary.config.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Determine resource_type based on file type
    let resourceType;
    const mimeType = req.file.mimetype;

    // Define allowed types for each resource type
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const videoTypes = ['video/mp4', 'video/mkv', 'video/avi'];
    const rawTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    ];

    if (imageTypes.includes(mimeType)) {
      resourceType = 'image';
    } else if (videoTypes.includes(mimeType)) {
      resourceType = 'video';
    } else if (rawTypes.includes(mimeType)) {
      resourceType = 'raw';
    } else {
      return res.status(400).json({ message: 'Unsupported file type' });
    }

    // Upload the file to Cloudinary with the correct resource type
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'T_154_Files', // Replace with your folder name
      resource_type: resourceType,
    });

    // Save file information to the database
    const file = new File({
      filename: result.original_filename,
      filepath: result.secure_url,
      size: req.file.size,
      mimetype: mimeType,
    });

    await file.save();

    res.status(201).json({ message: 'File uploaded successfully', file });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};
