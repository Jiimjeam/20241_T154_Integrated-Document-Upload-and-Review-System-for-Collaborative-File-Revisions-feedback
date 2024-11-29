import bcryptjs from "bcryptjs";
import crypto from "crypto";
import passport from "passport";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import jwt from "jsonwebtoken";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../model/User.js";


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

        // Update last login date
        user.lastLogin = new Date();
        await user.save();

        // Return response with user info and token
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
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
    Instructor: "http://localhost:5173/INTRdashboard",
    Senior_Faculty: "http://localhost:5173/Senior",
    Program_Chair: "http://localhost:5173/admin/home",
	CITL: "http://localhost:5173/admin/home",
	Admin: "http://localhost:5173/admin/home",
};

// Callback route where Google will redirect after successful login
export const googleAuthCallback = (req, res) => {
	passport.authenticate("google", { failureRedirect: "/login" }, async (err, user, info) => {
	  if (err || !user) {
		// Log any errors for debugging purposes
		console.error("Google Authentication failed:", err || info.message);
		return res.status(400).json({
		  success: false,
		  message: info?.message || "Google login failed",
		});
	  }
  
	  // Check if the user's account is approved or rejected
	  try {
		if (user.status === 'Pending') {
		  return res.status(403).json({
			success: false,
			message: "Your account is awaiting admin approval. Please wait for confirmation.",
		  });
		} else if (user.status === 'Rejected') {
		  return res.status(403).json({
			success: false,
			message: "Your account has been rejected. Contact the administrator for assistance.",
		  });
		}
  
		// If approved, redirect based on user role
		const redirectUrl = defaultDashboards[user.role];
		if (!redirectUrl) {
		  return res.status(403).json({
			success: false,
			message: "No dashboard assigned for your role.",
		  });
		}
  
		// Generate token and set it in a cookie
		generateTokenAndSetCookie(res, user._id);
  
		// Redirect the user to their respective dashboard
		return res.redirect(redirectUrl);
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

// Approve accounts
export const approveAccounts = async (req, res) => {
  const { userId } = req.params;
  const { status, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Account approved", user: updatedUser });
  } catch (err) {
    console.error("Error approving account:", err);
    res.status(500).json({ message: "Error approving account", error: err.message });
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
	const { userId } = req.params;
	const { role } = req.body;  // Extract new role from the request body
  
	// Validate the role
	if (!role || !['Instructor', 'Senior Faculty', 'Program Chair', 'CITL', 'Admin'].includes(role)) {
	  return res.status(400).json({ message: "Invalid role" });
	}
  
	try {
	  // Find the user by ID and update the role
	  const updatedUser = await User.findByIdAndUpdate(
		userId,
		{ role },
		{ new: true } // Return the updated document
	  );
  
	  // If user not found, return error
	  if (!updatedUser) {
		return res.status(404).json({ message: "User not found" });
	  }
  
	  // Return the updated user with the new role
	  res.status(200).json(updatedUser); 
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: "Failed to update the user role", error: err });
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



  
  
