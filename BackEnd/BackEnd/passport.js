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
      callbackURL: "/auth/google/callback", // Make sure this matches the one in your Google API Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if a user with the Google ID already exists
        let existingUser = await User.findOne({ googleId: profile.id });

        // If the user exists, log them in
        if (existingUser) {
          return done(null, existingUser);
        }

        // Check if a user with the same email exists (in case they signed up manually)
        existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          // If the user already exists, link the Google account with the existing user
          existingUser.googleId = profile.id;
          existingUser.isVerified = true; // Assuming email verification is handled by Google
          await existingUser.save();
          return done(null, existingUser);
        }

        // If no user exists, create a new one
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          isVerified: true, // Google ensures email verification
        });

        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
