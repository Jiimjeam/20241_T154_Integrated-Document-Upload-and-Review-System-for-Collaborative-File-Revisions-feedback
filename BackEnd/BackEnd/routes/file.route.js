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
} from "../controllers/file.controller.js";

const router = express.Router();

// Fetch all files or filter by status
router.get("/", getFiles);

// Fetch files by status (query parameter: ?status=approved)
router.get("/status", getFilesByStatus);

// Fetch file statistics (e.g., approved, pending, revision counts)
router.get("/stats", getFileStats);

router.get('/approved', getApprovedFiles);

router.get('/it-emc-files', getIT_EMCFiles),

// Approve a file
router.patch("/:id/approve", approveFile);

// Revise a file with a comment
router.patch("/:id/revise", reviseFile);

// Download a file by filepath
router.get("/download/:filepath", downloadFileByPath);

export default router;
