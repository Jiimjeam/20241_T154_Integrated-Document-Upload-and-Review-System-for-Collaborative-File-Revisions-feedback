import express from "express";
import {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
	updateUserSettings,
	getUsers,
	deleteUser,
	approveAccounts,
	getPendingAccounts,
	getApprovedAccounts,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.put('/update-settings', verifyToken, updateUserSettings);

router.get("/getusers", getUsers);

router.get("/users", getApprovedAccounts),

router.delete('/deleteuser/:id', deleteUser);

// Fetch pending accounts
router.get('/admin/get/pending-accounts', getPendingAccounts);

// Approve a user's account
router.put('/admin/approve-user/:userId', approveAccounts);


export default router;