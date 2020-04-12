import config from "config";
import passport from "passport";
import { Request, Response } from "express";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth2";

import { User, ProviderProfile } from "../models/user";

/**
 * Helper function to let an async Promise work with a callback function.
 */
function callbackize<T>(run: () => Promise<T>, cb: (e?: Error, t?: T) => void): void {
  try {
    run().then(t => cb(undefined, t));
  } catch (e) {
    cb(e);
  }
}

passport.use(new GoogleStrategy({
  clientID: config.get("secrets.GOOGLE_CLIENT_ID"),
  clientSecret: config.get("secrets.GOOGLE_CLIENT_SECRET"),
  callbackURL: `${config.get("app.defaultURL")}/auth/google/return`,
  scope: ["profile", "email"]
},
(_at, _rt, profile, callback: VerifyCallback) => {
  if(profile.verified) {
    callbackize(async () => await User.findOrCreate(profile as ProviderProfile), callback);
  } else {
    return callback(new Error("User profile is not verified"));
  }
}));


passport.serializeUser((user: User, cb) => cb(null, user.id));
passport.deserializeUser((obj: number, cb) => {
  callbackize(async () => User.findOne({ id: obj }), cb);
});

/**
 * GET /login
 *
 * Generic login page where a user can choose how they wish to authenticate
 * themselves.
 */
export async function login(req: Request, res: Response): Promise<void> {
  res.render("login", {
    title: "Login",
    flash: req.flash,
  });
}

/**
 * GET /logout
 *
 * Destroy the user's session.
 */
export async function logout(req: Request, res: Response): Promise<void> {
  req.flash("info", "Je werd afgemeld.")
  req.session = null;
  res.redirect("/");
}
