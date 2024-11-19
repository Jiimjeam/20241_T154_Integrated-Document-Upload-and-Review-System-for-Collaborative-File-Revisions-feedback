import express from "express";
import { getFiles, approveFile, reviseFile, downloadFileByPath } from "../controllers/file.controller.js";

const router = express.Router();

// Fetch all files
router.get("/", getFiles);

// Approve a file
router.patch("/:id/approve", approveFile);

// Revise a file with a comment
router.patch("/:id/revise", reviseFile);

// Download a file by filepath
router.get("/download/:filepath", downloadFileByPath);



export default router;
