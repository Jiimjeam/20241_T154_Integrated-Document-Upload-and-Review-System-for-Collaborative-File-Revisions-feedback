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
	updateRole,
	unlockRole,
	checkRoleLock,

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

router.get("/getusers",verifyToken, getUsers);

router.get("/users", verifyToken,getApprovedAccounts),

router.delete('/users/:userId',verifyToken, deleteUser);

// Fetch pending accounts
router.get('/admin/get/pending-accounts',verifyToken, getPendingAccounts);

// Approve a user's account
router.put('/admin/approve-user/:userId',verifyToken, approveAccounts);


router.put('/:userId/update-role', updateRole);
router.post('/:userId/unlock-role', unlockRole);
router.get('/:userId/check-role', checkRoleLock);

export default router;