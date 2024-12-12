import express from "express";
import { 
  getFiles, 
  approveFile, 
  reviseFile, 
  downloadFileByPath, 
  getFileStats, 
  getFilesByStatus, 
  getApprovedFiles, 
  getIT_EMCFiles,
  getFilesByUploader,
  getMathematicsFiles,
  getFilesByUserDepartment,
} from "../controllers/file.controller.js";
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/department', verifyToken, getFilesByUserDepartment);

// Fetch all files
router.get("/", getFiles);

// Fetch files by uploaderUserId (authenticated user)
router.get('/uploader', verifyToken, getFilesByUploader);
  
// Fetch files by status
router.get("/status", getFilesByStatus);

// Fetch file statistics
router.get("/stats", getFileStats);

// Fetch approved files
router.get('/approved', getApprovedFiles);

router.get('/it-emc-files', getIT_EMCFiles),

router.get('/mathematics', getMathematicsFiles),


// Approve a file
router.patch("/:id/approve", approveFile);

// Revise a file
router.patch("/:id/revise", reviseFile);

// Download a file by filepath
router.get("/download/:filepath", downloadFileByPath);

export default router;
