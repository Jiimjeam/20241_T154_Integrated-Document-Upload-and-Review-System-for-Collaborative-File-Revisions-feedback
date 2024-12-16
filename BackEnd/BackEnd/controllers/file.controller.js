import File from "../model/File.js";
import { User } from "../model/User.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import nodemailer from 'nodemailer';
import  { Notification } from "../model/Notification.js";

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

export const approveFile = async (req, res) => {
  try {
    // Update file status to "approved" and populate uploader details
    const file = await File.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).populate('uploaderUserId'); // Populate uploader's details

    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }

    const uploader = file.uploaderUserId; // Fetch uploader details from populated data
    if (!uploader || !uploader.email) {
      return res.status(404).json({ error: "Uploader not found or missing email." });
    }

    // Email configuration using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your preferred email service
      auth: {
        user: process.env.EMAIL, // Email address from environment variables
        pass: process.env.EMAIL_PASSWORD, // Password or app password from environment variables
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: uploader.email, // Send email to uploader's email
      subject: "Your File has been Approved by Your Department",
      text: `Hello ${uploader.name},\n\nYour file "${file.filename}" has been approved by your Department. Please review its status in the system.\n\nBest regards,\nYour Team`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Create a notification for the uploader
    await Notification.create({
      userId: uploader._id,
      title: "File Approved",
      message: `Your file "${file.filename}" has been approved.`,
    });

    // Respond with success
    res.status(200).json({ file, message: "File approved, email notification sent, and notification created." });
  } catch (error) {
    console.error("Error approving file:", error.message);
    res.status(500).json({ error: "Error approving file." });
  }
};



export const ReadyToPrint = async (req, res) => {
  try {
    // Fetch the file by ID and populate uploader's details
    const file = await File.findByIdAndUpdate(
      req.params.id,
      { status: "ready to print" },
      { new: true }
    ).populate('uploaderUserId'); // Populate uploader details

    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }

    const uploader = file.uploaderUserId; // Extract uploader details
    if (!uploader || !uploader.email) {
      return res.status(404).json({ error: "Uploader not found or email missing." });
    }

    // Log the email (for debugging)
    console.log("Uploader's Email:", uploader.email);

    // Example: Use uploader.email in your email notification logic
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or another email provider
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: uploader.email,
      subject: "File Ready to Print",
      text: `Hello ${uploader.name},\n\nYour file "${file.filename}" has been approved and is ready to print.\n\nBest regards,\nYour Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully", file });
  } catch (error) {
    console.error("Error fetching uploader's email or sending notification:", error.message);
    res.status(500).json({ error: "Server error." });
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

    // Fetch the file by ID and push the new comment to the revisions array
    const file = await File.findByIdAndUpdate(
      fileId,
      {
        status: "revision", // Update the status to "revision"
        $push: { revisionComments: { comment } }, // Append the new comment
      },
      { new: true }
    ).populate('uploaderUserId'); // Populate uploader details

    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }

    const uploader = file.uploaderUserId; // Extract uploader details
    if (!uploader || !uploader.email) {
      return res.status(404).json({ error: "Uploader not found or email missing." });
    }

    // Log the email (for debugging)
    console.log("Uploader's Email:", uploader.email);

    // Example: Use uploader.email in your email notification logic
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or another email provider
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: uploader.email,
      subject: "File Under Revision",
      text: `Hello ${uploader.name},\n\nYour file "${file.filename}" has been revised with a new comment: "${comment}".\n\nBest regards,\nYour Team`,
    };

    await transporter.sendMail(mailOptions);

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

export const getAutomotiveFiles = async (req, res) => {
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


export const getElectronicsFiles = async (req, res) => {
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

export const getFoodFiles = async (req, res) => {
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





  
  