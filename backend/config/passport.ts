import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/user.model";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, undefined);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:7000/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails || !profile.emails[0]?.value) {
          return done(
            new Error("No email found from Google account"),
            undefined
          );
        }

        // Check if user already exists by googleId or email
        let existingUser = await UserModel.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });

        if (existingUser) {
          // If user exists but doesn't have googleId (registered through email), update with googleId
          if (!existingUser.googleId) {
            existingUser.googleId = profile.id;
            existingUser.picture = profile.photos?.[0]?.value;
            await existingUser.save();
          }
          return done(null, existingUser);
        }

        // If not, create a new user
        const newUser = new UserModel({
          googleId: profile.id,
          username:
            profile.displayName || profile.emails[0].value.split("@")[0],
          email: profile.emails[0].value,
          picture: profile.photos?.[0]?.value,
        });

        await newUser.save();
        console.log("New user created:", newUser);
        done(null, newUser);
      } catch (error) {
        console.error("Error in Google strategy:", error);
        done(error, undefined);
      }
    }
  )
);

export default passport;
