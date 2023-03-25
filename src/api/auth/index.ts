import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../../../config";
import { registerUser } from "./../utils";
import { cache } from "../../..";
import { Role } from "../../entity";

const authRouter = express.Router();

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
      };

      done(null, user);
    },
  ),
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req: Request, res: Response) => {
    const accessToken = generateAccessToken(req.user);
    const roles = await cache.get("roles");

    const role = roles.find((role: Role) => role.name === "User");

    const registeredUser = await registerUser(
      req.user.name,
      req.user.username,
      req.user.email,
      req.user.picture,
      role,
    );
    const expiresLn = 60 * 60 * 24 * 7 * 1000;
    const user = {
      id: registeredUser.id,
      name: registeredUser.name,
      email: registeredUser.email,
      picture: registeredUser.picture,
      role: registeredUser.role.name,
    };

    const callbackUrl = await cache.get("callbackURL");
    const defaults = await cache.get("defaults");
    const sdModels = await cache.get("stableDiffusionModels");

    if (callbackUrl) {
      const params = new URLSearchParams({
        accessToken: accessToken,
        expiresLn: expiresLn.toString(),
        user: JSON.stringify(user),
        defaults: JSON.stringify(defaults),
        sdModels: JSON.stringify(sdModels),
      });
      res.redirect(`${callbackUrl}?${params}`);
    } else {
      res.json({ accessToken, expiresLn, user });
    }
  },
);
function generateAccessToken(user) {
  return jwt.sign(user, config.JWT_SECRET, { expiresIn: "7d" });
}

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

export { authRouter };
