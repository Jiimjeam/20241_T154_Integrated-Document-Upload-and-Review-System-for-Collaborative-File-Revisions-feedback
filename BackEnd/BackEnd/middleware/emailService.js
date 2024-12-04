import nodemailer from 'nodemailer';

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    logger: true, // Enable logging for debug info
    debug: true,  // Enable debug mode for detailed error messages
  });

// Email service for pending account notification
export async function sendAccountPendingEmail(userEmail) {
  if (!userEmail) {
    console.error("User email is not available");
    return { success: false, message: "User email not found." };
  }

  const mailOptions = {
    from: 'arvinglennaguid@gmail.com',  // Sender address
    to: userEmail,                    // Recipient's email address
    subject: 'Your Account is Pending Approval',
    text: `Hello! Thank you for signing up with us. Your account is currently pending approval by the admin. We will notify you once it's approved.`,
  };

  try {
    // Try sending the email
    await transporter.sendMail(mailOptions);
    console.log(`Pending account notification sent to ${userEmail}`);
    return { success: true };  // Indicate that email was successfully sent
  } catch (error) {
    console.error("Error sending pending account email:", error);
    return { success: false, message: "Failed to send pending account email." };
  }
}

// Inside sendAccountApprovedEmail
export async function sendAccountApprovedEmail(userEmail) {
    console.log(`Attempting to send approval email to: ${userEmail}`);
    if (!userEmail) {
      console.error("User email is not available");
      return { success: false, message: "User email not found." };
    }
  
    const mailOptions = {
      from: 'arvinglennaguid@gmail.com',  // Sender address
      to: userEmail,                    // Recipient's email address
      subject: 'Your Account Has Been Approved',
      text: `Hello! Congratulations! Your account has been approved by the admin. You can now log in using the following link: \n\n [Login Page](http://localhost:5173/login) \n\nIf you have any issues, please contact support.`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Approved account notification sent to ${userEmail}`);
      return { success: true };
    } catch (error) {
      console.error("Error sending approved account email:", error);
      return { success: false, message: "Failed to send approved account email." };
    }
  }
  
 // Email service for rejected account notification
export async function sendAccountRejectedEmail(userEmail) {
    console.log(`Attempting to send rejection email to: ${userEmail}`);
    
    // Check if the user email exists
    if (!userEmail) {
      console.error("User email is not available");
      return { success: false, message: "User email not found." };
    }
  
    const mailOptions = {
      from: process.env.EMAIL,   // Sender's email (should be in .env for security)
      to: userEmail,             // Recipient's email
      subject: 'Your Account Has Been Rejected',  // Email subject
      text: `Hello! We regret to inform you that your account has been rejected. If you have any questions or need clarification, please contact our support team at support@yourapp.com.\n\nThank you.`,  // Body of the email
    };
  
    try {
      // Send email
      const info = await transporter.sendMail(mailOptions);
  
      // Log and return success
      console.log(`Rejected account notification sent to ${userEmail}, Message ID: ${info.messageId}`);
      return { success: true };
    } catch (error) {
      // Detailed error handling
      console.error("Error sending rejected account email:", error);
      return { success: false, message: `Failed to send rejected account email. Error: ${error.message}` };
    }
  }
  
  