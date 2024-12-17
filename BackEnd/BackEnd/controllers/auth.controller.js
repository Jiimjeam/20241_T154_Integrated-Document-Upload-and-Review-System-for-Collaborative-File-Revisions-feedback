import bcryptjs from "bcryptjs";
import crypto from "crypto";
import passport from "passport";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendAccountPendingEmail,sendAccountApprovedEmail,sendAccountRejectedEmail } from "../middleware/emailService.js";
import jwt from "jsonwebtoken";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../model/User.js";
import mongoose from 'mongoose'; // Add this line at the top of the file



//admin functions 
export const getUsers = async (req, res) => { 
	User.find()
	.then(Users => res.json(Users))
	.catch(err => res.json(err))
}

export const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});

		await user.save();

		// jwt
		generateTokenAndSetCookie(res, user._id);

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Validate password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate token and set cookie
        const token = generateTokenAndSetCookie(res, user._id);
		localStorage.setItem("userId", response.data.userId);
    	localStorage.setItem("token", response.data.token);

        // Update last login date
        user.lastLogin = new Date();
        await user.save();

        // Return response with user info and token
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
			userId: user._id, // Include userId
            token, // Include the token in the response body
            user: {
                ...user._doc,
                password: undefined, // Exclude password from response
            },
        });
    } catch (error) {
        console.error("Error in login: ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

// Redirect to Google for login
export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

const defaultDashboards = {
    Instructor: "http://localhost:5173/INTRdashboard/Home",
    Senior_Faculty: "http://localhost:5173/Senior/Home",
    Program_Chair: "http://localhost:5173/Program/Home",
    CITL: "http://localhost:5173/CITL/Home",
    Admin: "http://localhost:5173/admin",
};

export const googleAuthCallback = (req, res) => {
    passport.authenticate("google", { failureRedirect: "/login" }, async (err, user, info) => {
        if (err || !user) {
            console.error("Google Authentication failed:", err || info.message);
            return res.status(400).json({
                success: false,
                message: info?.message || "Google login failed",
            });
        }

        try {
            console.log("User authenticated:", user); // Log user details for debugging

            // Handle account statuses
            if (user.status === 'Pending') {
                // Send pending email and notify the frontend to display the pending page
                await sendAccountPendingEmail(user.email);  // Email for pending account status
                return res.redirect('http://localhost:5173/pending'); // Redirect to pending page
            } else if (user.status === 'Rejected') {
                // Send rejection email and notify the frontend
                await sendAccountRejectedEmail(user.email);  // Send rejection email
                return res.status(403).json({
                    success: false,
                    status: 'Rejected',  // Frontend will display the rejection message
                    message: "Your account has been rejected. Please contact the administrator for assistance.",
                });
            } else if (user.status === 'Approved') {

                // Generate token and set cookie for approved accounts
				generateTokenAndSetCookie(res, user._id);

                const redirectUrl = defaultDashboards[user.role];

                if (redirectUrl) {
                    return res.redirect(redirectUrl); // Redirect to the appropriate dashboard
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "No dashboard found for the user's role.",
                    });
                }
            } else {
                // Handle any unexpected status
                return res.status(400).json({
                    success: false,
                    message: "Unknown account status.",
                });
            }
        } catch (error) {
            console.error("Error during user approval check:", error);
            return res.status(500).json({
                success: false,
                message: "An internal server error occurred.",
            });
        }
    })(req, res);
};


// Fetch users with 'Pending' status
export const getPendingAccounts = async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'Pending' }).select("-password -googleId");

    if (!pendingUsers || pendingUsers.length === 0) {
      return res.status(404).json({ message: "No pending accounts found" });
    }

    res.json(pendingUsers);
  } catch (err) {
    console.error("Error fetching pending accounts:", err);
    res.status(500).json({ message: "Error fetching pending accounts", error: err.message });
  }
};

// Approve or reject accounts
export const approveAccounts = async (req, res) => {
	const { userId } = req.params;
	const { status, role } = req.body;
  
	try {
	  // If the account is rejected, we should delete it from the database.
	  if (status === 'Rejected') {
		// Attempt to delete the user
		const deletedUser = await User.findByIdAndDelete(userId); // Delete the user from the database
  
		// If the user wasn't found, return an error response
		if (!deletedUser) {
		  return res.status(404).json({ message: "User not found" });
		}
  
		// Send rejection email
		const emailResult = await sendAccountRejectedEmail(deletedUser.email);
		if (!emailResult.success) {
		  return res.status(500).json({ message: "Failed to send rejection email." });
		}
  
		// Respond with a success message after rejection
		return res.json({ message: "Account rejected and user deleted", user: deletedUser });
	  }
  
	  // Otherwise, handle the approval logic
	  const updatedUser = await User.findByIdAndUpdate(
		userId,
		{ status, role },
		{ new: true }
	  );
  
	  // If the user was not found or the update failed, return an error
	  if (!updatedUser) {
		return res.status(404).json({ message: "User not found" });
	  }
  
	  // If the account is approved, send the approval email
	  if (updatedUser.status === 'Approved') {
		const emailResult = await sendAccountApprovedEmail(updatedUser.email);  // Send the approval email
		if (!emailResult.success) {
		  return res.status(500).json({ message: "Failed to send approval email." });
		}
	  }
  
	  // Respond with a success message for approval
	  res.json({ message: "Account approved and email sent", user: updatedUser });
	} catch (err) {
	  console.error("Error handling account approval or rejection:", err);
	  res.status(500).json({ message: "Error handling account request", error: err.message });
	}
  };

// Fetch users with 'Approved' status
export const getApprovedAccounts = async (req, res) => {
	try {
	  const approvedUsers = await User.find({ status: 'Approved' }).select("-password -googleId");
  
	  if (!approvedUsers || approvedUsers.length === 0) {
		return res.status(404).json({ message: "No approved accounts found" });
	  }
  
	  res.json(approvedUsers);
	} catch (err) {
	  console.error("Error fetching approved accounts:", err);
	  res.status(500).json({ message: "Error fetching approved accounts", error: err.message });
	}
  };

  export const updateRole = async (req, res) => {
	const { userId } = req.params; // ID of the user whose role is being updated
	const { role, editorId } = req.body; // New role and editor's ID
  
	// Validate role input
	const validRoles = ['Instructor', 'Senior_Faculty', 'Program_Chair', 'CITL', 'Admin'];
	if (!role || !validRoles.includes(role)) {
	  return res.status(400).json({ message: "Invalid role specified." });
	}
  
	
  
	try {
	  // Fetch user from the database
	  const user = await User.findById(userId);
	  if (!user) {
		return res.status(404).json({ message: "User not found." });
	  }
  
	  // Lock management
	  const LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes
	  const currentTime = Date.now();
  
	  const lockExpired =
		!user.lock?.userId || user.lock.lockedAt < currentTime - LOCK_TIMEOUT;
  
	  // If lock has expired or no lock exists, assign a new lock to the current editor
	  if (lockExpired) {
		user.lock = { userId: new mongoose.Types.ObjectId(editorId), lockedAt: currentTime };
	  } 
	  // If lock exists and belongs to another editor, deny access
	  else if (user.lock.userId.toString() !== editorId) {
		return res.status(423).json({
		  message: "User role is currently locked by another editor.",
		  lockedBy: user.lock.userId,
		  lockedAt: user.lock.lockedAt,
		});
	  }
  
	  // At this point, the lock is either expired or belongs to the current editor
	  user.role = role;
	  await user.save();
  
	  return res.status(200).json({
		message: "Role updated successfully.",
		user: {
		  _id: user._id,
		  role: user.role,
		  lock: user.lock,
		},
	  });
	} catch (err) {
	  console.error("Error updating role:", err);
	  return res.status(500).json({ message: "Failed to update role.", error: err.message });
	}
  };
  
  export const unlockRole = async (req, res) => {
	const { userId } = req.params;
  
	try {
	  // Remove the lock from the user document
	  const user = await User.findByIdAndUpdate(
		userId,
		{ $unset: { lock: "" } }, // Unset the lock field
		{ new: true }
	  );
  
	  if (!user) {
		return res.status(404).json({ message: "User not found." });
	  }
  
	  return res.status(200).json({
		message: "Role lock removed successfully.",
		user
	  });
	} catch (err) {
	  console.error("Error unlocking role:", err);
	  return res.status(500).json({ message: "Failed to unlock role.", error: err.message });
	}
  };
  
  export const checkRoleLock = async (req, res) => {
	const { userId } = req.params;
  
	try {
	  const user = await User.findById(userId);
  
	  if (!user) {
		return res.status(404).json({ message: "User not found." });
	  }
  
	  const LOCK_TIMEOUT = 5 * 60 * 1000; // Lock timeout: 5 minutes
	  const lockExpired = !user.lock?.userId || user.lock.lockedAt < Date.now() - LOCK_TIMEOUT;
  
	  if (lockExpired) {
		return res.status(200).json({
		  message: "No active lock on this role.",
		  lockStatus: "unlocked",
		});
	  }
  
	  return res.status(423).json({
		message: "Role is currently locked.",
		lockStatus: "locked",
		lockedBy: user.lock.userId,
		lockedAt: user.lock.lockedAt,
	  });
	} catch (err) {
	  console.error("Error checking role lock:", err);
	  return res.status(500).json({ message: "Failed to check role lock.", error: err.message });
	}
  };
  
  
  
  

  export const deleteUser = async (req, res) => {
	const { userId } = req.params;  // Extract the userId from the request parameters
  
	try {
	  // Attempt to find and delete the user by their ID
	  const deletedUser = await User.findByIdAndDelete(userId);
  
	  // Check if the user was found and deleted
	  if (!deletedUser) {
		return res.status(404).json({ message: "User not found" });
	  }
  
	  // Return a success message
	  res.status(200).json({ message: "User deleted successfully" });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: "Failed to delete user", error: err });
	}
  };
  
  
  
export const updateUserSettings = async (req, res) => {
    const { college, department } = req.body;

    try {
        const userId = req.userId; // Extract user ID from the token

        // Construct updated data
        const updatedData = {
            college,
            department: department || null,  // Accept department for any college, or set to null if not provided
        };

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            user
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};



  
  