import File from "../model/File.js";
import { User } from "../model/User.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Convert __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const getFilesByUserDepartment = async (req, res) => {
  try {
    const userId = req.userId; // Extract the logged-in user's ID (from authentication middleware)

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // Fetch user details
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const { department } = user;
    if (!department) {
      console.warn(`User with ID ${userId} has no department specified.`);
      return res.status(400).json({ success: false, message: "User's department not specified." });
    }

    // Pagination parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);

    // Query files
    const files = await File.find({ department })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("filename filepath size mimetype status author coAuthor subjectCode") // Include subjectCode
        .lean();


    const totalFiles = await File.countDocuments({ department });

    res.status(200).json({
      success: true,
      message: files.length ? "Files fetched successfully." : "No files found for the user's department.",
      files,
      pagination: { totalFiles, page, limit },
    });
  } catch (error) {
    console.error({
      message: "Error fetching files by user's department",
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "Error fetching files by user's department.",
      error: error.message,
    });
  }
};

export const getFilesByUserDepartment_Status = async (req, res) => {
  try {
    const userId = req.userId; // Extract the logged-in user's ID (from authentication middleware)

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // Fetch user details
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const { department } = user;
    if (!department) {
      console.warn(`User with ID ${userId} has no department specified.`);
      return res.status(400).json({ success: false, message: "User's department not specified." });
    }

    // Pagination parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);

    // Query files with the 'approved' status
    const queryCondition = { department, status: "approved" }; // Add 'status: "approved"' condition
    const files = await File.find(queryCondition)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("filename filepath size mimetype status author coAuthor subjectCode") // Include subjectCode
      .lean();

    const totalFiles = await File.countDocuments(queryCondition);

    res.status(200).json({
      success: true,
      message: files.length ? "Files fetched successfully." : "No approved files found for the user's department.",
      files,
      pagination: { totalFiles, page, limit },
    });
  } catch (error) {
    console.error({
      message: "Error fetching files by user's department",
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "Error fetching files by user's department.",
      error: error.message,
    });
  }
};


// Fetch all files
export const getFiles = async (req, res) => {
  try {
    const files = await File.find({});
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files 11:", error.message);
    res.status(500).json({ error: "Error fetching files11." });
  }
};

// Fetch files by uploaderUserId
export const getFilesByUploader = async (req, res) => {
  try {
    const uploaderUserId = req.userId; // Extract from `verifyToken`
    if (!uploaderUserId) {
      return res.status(401).json({ message: 'Unauthorized: No valid user found' });
    }

    const files = await File.find({ uploaderUserId }); // Filter by uploaderUserId

    if (!files.length) {
      return res.status(404).json({ message: 'No files found for this user.' });
    }

    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files by uploaderUserId:', error.message);
    res.status(500).json({ error: 'Error fetching files by uploaderUserId.' });
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
    const fileId = req.params.id;

    if (!comment || !fileId) {
      return res.status(400).json({ error: "File ID and comment are required." });
    }

    // Find the file and push the new comment
    const file = await File.findByIdAndUpdate(
      fileId,
      {
        status: "revision",
        $push: { revisionComments: { comment } }, // Append the new comment
      },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }

    res.status(200).json({ message: "File revised successfully.", file });
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
// Fetch file statistics
export const getFileStats = async (req, res) => {
  try {
    const approved = await File.countDocuments({ status: "approved" });
    const pending = await File.countDocuments({ status: "pending" });
    const revision = await File.countDocuments({ status: "revision" });

    // Calculate the total
    const total = approved + pending + revision;

    res.status(200).json({ approved, pending, revision, total });
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

// Fetch comments by file ID
export const getComments = async (req, res) => {
  const { fileId } = req.params;
  try {
    const file = await File.findById(fileId); // Fetch the file by ID
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Extract only the 'comment' text from each revisionComment object
    const comments = file.revisionComments.map(comment => comment.comment);

    res.status(200).json(comments); // Return only the comments array (text only)
  } catch (err) {
    res.status(500).json({ error: 'Error fetching comments.' });
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

export const getITFiles = async (req, res) => {
  const { department } = req.query; 
  const status = 'approved'; 

  try {
    const query = { status };
    if (department) query.department = department;

    const files = await File.find(query);

    if (!files.length) {
      return res.status(404).json({
        success: false,
        message: department
          ? `No approved files found for the department: ${department}.`
          : 'No approved files found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Approved files fetched successfully.',
      files,
    });
  } catch (error) {
    console.error('Error fetching files:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved files.',
      error: error.message,
    });
  }
};

export const getMathematicsFiles = async (req, res) => {
  const { department } = req.query; 
  const status = 'approved'; 

  try {
    const query = { status };
    if (department) query.department = department;

    const files = await File.find(query);

    if (!files.length) {
      return res.status(404).json({
        success: false,
        message: department
          ? `No approved files found for the department: ${department}.`
          : 'No approved files found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Approved files fetched successfully.',
      files,
    });
  } catch (error) {
    console.error('Error fetching files:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved files.',
      error: error.message,
    });
  }
};


  
  