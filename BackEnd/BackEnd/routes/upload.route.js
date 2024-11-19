import express from 'express';
import { uploadFile, getUploadedFiles, deleteFile, sendFile,getUsers } from '../controllers/upload.controller.js';
import { upload } from '../middleware/fileUpload.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getUploadedFiles); // Fetch all uploaded files
router.delete('/:id', deleteFile); // Delete a file by ID

// New route for sending a file
router.post('/send-file', sendFile);
// New route to fetch all users
router.get('/users', getUsers); // Fetch all users

export default router;
