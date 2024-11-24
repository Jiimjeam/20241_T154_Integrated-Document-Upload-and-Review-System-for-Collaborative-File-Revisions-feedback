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

// Define predefined user dashboard routes
const userDashboards = {
	"2201102843@student.buksu.edu.ph": "http://localhost:5173/INTRdashboard/Home",
	"2201105872@student.buksu.edu.ph": "http://localhost:5173/INTRdashboard/Home",
	"renesale0@gmail.com": "http://localhost:5173/dashboard",
};

// Callback route where Google will redirect after successful login
export const googleAuthCallback = (req, res) => {
	passport.authenticate("google", { failureRedirect: "/login" }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({ success: false, message: "Google login failed" });
		}

		
		const redirectUrl = userDashboards[user.email];

		if (redirectUrl) {
			generateTokenAndSetCookie(res, user._id);

			// Redirect to the user-specific dashboard
			return res.redirect(redirectUrl);
		} else {
			// Notify the user that they are not registered in the system
			return res.status(403).json({
				success: false,
				message: "You are not authorized to use this system.",
			});
		}
	})(req, res);
};

export const updateUserSettings = async (req, res) => {
    const { college, department } = req.body;

    // Validate department based on the college
    if (college !== 'COT' && department) {
        return res.status(400).json({
            success: false,
            message: "Department is only valid for the COT college"
        });
    }

    try {
        const userId = req.userId; // Extract user ID from the token
        const updatedData = { college, department: college === 'COT' ? department : null };

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