import express from 'express';
import { uploadProfileImage, getProfileImage, upload } from '../controllers/userController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/profile-image', verifyToken, upload, uploadProfileImage); // 👈 add multer middleware
router.get('/profile', verifyToken, getProfileImage);

export default router;
