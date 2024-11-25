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
} from "../controllers/file.controller.js";
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

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

// Fetch IT & EMC files
router.get('/it-emc-files', getIT_EMCFiles);

// Approve a file
router.patch("/:id/approve", approveFile);

// Revise a file
router.patch("/:id/revise", reviseFile);

// Download a file by filepath
router.get("/download/:filepath", downloadFileByPath);

export default router;
