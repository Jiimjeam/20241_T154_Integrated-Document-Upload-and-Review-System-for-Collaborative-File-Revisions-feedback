import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import passport from "passport";
import "./passport.js"; // Import the Google OAuth configuration
import { googleAuth, googleAuthCallback } from "./controllers/auth.controller.js";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json()); 
app.use(cookieParser()); 
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Route to start Google OAuth
app.get("/auth/google", googleAuth);

// Google OAuth callback route
app.get("/auth/google/callback", googleAuthCallback);


app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});

