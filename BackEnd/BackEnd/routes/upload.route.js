import express from 'express';
import { 
  uploadFile, 
  getUploadedFiles, 
  deleteFile, 
  sendFile, 
  getUsers,
  getUploadedFilesByUploader,
} from '../controllers/upload.controller.js';
import { upload } from '../middleware/fileUpload.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Upload a file
router.post('/upload', verifyToken, upload.single('file'), uploadFile);

// Fetch all uploaded files
router.get('/', getUploadedFiles);



// Fetch uploaded files by uploaderUserId (authenticated user)
router.get('/uploader', verifyToken, getUploadedFilesByUploader);

// New route for sending a file
router.post('/send-file', sendFile);

// New route to fetch all users
router.get('/users', getUsers);

// Delete a file by ID
router.delete('/files/:id', deleteFile);

export default router;
