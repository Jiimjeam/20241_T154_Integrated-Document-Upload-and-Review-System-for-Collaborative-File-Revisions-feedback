import File from "../model/File.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Convert __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fetch all files
export const getFiles = async (req, res) => {
  try {
    const files = await File.find({}); // Optionally filter files based on criteria
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files:", error.message);
    res.status(500).json({ error: "Error fetching files." });
  }
};

// Approve a file
export const approveFile = async (req, res) => {
  try {
    const file = await File.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.status(200).json({ file });
  } catch (error) {
    console.error("Error approving file:", error.message);
    res.status(500).json({ error: "Error approving file." });
  }
};

// Revise a file with a comment
export const reviseFile = async (req, res) => {
  try {
    const { comment } = req.body;
    const file = await File.findByIdAndUpdate(
      req.params.id,
      { status: "revision", revisionComment: comment },
      { new: true }
    );
    res.status(200).json({ file });
  } catch (error) {
    console.error("Error revising file:", error.message);
    res.status(500).json({ error: "Error revising file." });
  }
};

export const downloadFileByPath = (req, res) => {
    const filepath = decodeURIComponent(req.params.filepath);
  
    // Handle external URLs
    if (filepath.startsWith("http://") || filepath.startsWith("https://")) {
      return res.redirect(filepath);
    }
  
    // Handle local file paths
    const absolutePath = path.resolve(filepath);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "File not found on the server." });
    }
  
    res.download(absolutePath, (err) => {
      if (err) {
        console.error("Error during file download:", err);
        res.status(500).json({ message: "Error downloading file." });
      }
    });
  };
  
  