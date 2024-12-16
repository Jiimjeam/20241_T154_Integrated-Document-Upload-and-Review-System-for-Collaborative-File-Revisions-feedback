import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./model/User.js";  // Import User model
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:", profile); // Log profile data

      try {
        // Check if a user with the Google ID already exists
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          // User already exists
          return done(null, existingUser);
        }

        // If no user, create a new one
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          isVerified: true, // Google ensures email verification
          status: 'Pending', // Default status is Pending
        });

        console.log("Created new user:", newUser); // Log new user creation

        done(null, newUser);
      } catch (error) {
        console.error("Error during Google authentication:", error); // Log errors
        done(error, false);
      }
    }
  )
);
