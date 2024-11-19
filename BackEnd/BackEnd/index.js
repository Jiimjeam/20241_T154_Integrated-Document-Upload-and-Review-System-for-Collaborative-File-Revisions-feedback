import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import passport from "passport";
import "./passport.js"; // Import the Google OAuth configuration
import { googleAuth, googleAuthCallback } from "./controllers/auth.controller.js";
import uploadRoutes from "./routes/upload.route.js";
import fileRoutes from "./routes/file.route.js"; // Import the new file routes
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); 
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes); // File upload route
app.use("/api/files", fileRoutes); // New file management route

// Serve static files if in production mode
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Google OAuth routes
app.get("/auth/google", googleAuth);
app.get("/auth/google/callback", googleAuthCallback);

console.log("Cloudinary Config:", process.env.CLOUD_NAME);

// Start the server
app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port:", PORT);
});
