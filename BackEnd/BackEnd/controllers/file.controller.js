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

  // Fetch file statistics
export const getFileStats = async (req, res) => {
  try {
    const approved = await File.countDocuments({ status: "approved" });
    const pending = await File.countDocuments({ status: "pending" });
    const revision = await File.countDocuments({ status: "revision" });

    res.status(200).json({ approved, pending, revision });
  } catch (error) {
    console.error("Error fetching file stats:", error.message);
    res.status(500).json({ error: "Error fetching file stats." });
  }
};

// Fetch files by status
export const getFilesByStatus = async (req, res) => {
  const { status } = req.query; // Accept status as query parameter
  try {
    const files = await File.find(status ? { status } : {});
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files by status:", error.message);
    res.status(500).json({ error: "Error fetching files by status." });
  }
};

export const getApprovedFiles = async (req, res) => {
  const { status } = req.query; // e.g., status=approved
  try {
    const files = await File.find(status ? { status } : {});
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files.' });
  }
};

export const getIT_EMCFiles = async (req, res) => {
  const { department } = req.query;  // Get `department` from query params
  const status = 'approved'; // Only fetch approved files

  try {
    // If `department` is provided, filter by department; otherwise, fetch all approved files
    const query = department ? { department, status } : { status };
    const files = await File.find(query);

    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No approved files found for the specified department.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Approved files fetched successfully.',
      files,  // Send approved files as part of the response
    });
  } catch (error) {
    console.error('Error fetching files:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching files.',
      error: error.message,
    });
  }
};
export const getMathematicsFiles = async (req, res) => {
  const { department } = req.query;  // Get `department` from query params
  const status = 'approved'; // Only fetch approved files

  try {
    // If `department` is provided, filter by department; otherwise, fetch all approved files
    const query = department ? { department, status } : { status };
    const files = await File.find(query);

    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No approved files found for the specified department.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Approved files fetched successfully.',
      files,  // Send approved files as part of the response
    });
  } catch (error) {
    console.error('Error fetching files:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching files.',
      error: error.message,
    });
  }
};


  
  
  