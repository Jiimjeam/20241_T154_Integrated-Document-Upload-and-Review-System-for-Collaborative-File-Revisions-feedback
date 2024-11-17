// routes/upload.route.js
import express from 'express';
import { uploadFile } from '../controllers/upload.controller.js';
import { upload } from '../middleware/fileUpload.js';

const router = express.Router();

router.post('/', upload.single('file'), uploadFile);

export default router;
