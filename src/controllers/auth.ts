import util from "util";
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
  User.findOne({ id: obj }).then(user => {
    if (user) {
      cb(null, user);
    } else {
      cb("Something went wrong. Try clearing your cookies for this site.");
    }
  });
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
  });
}

/**
 * GET /logout
 *
 * Destroy the user's session.
 */
export async function logout(req: Request, res: Response): Promise<void> {
  req.session = null;
  req.flash("info", "Je werd afgemeld.");
  res.redirect("/");
}

/**
 * GET /auth/dev/login
 *
 * Log in as the user with id 1. Should only be available in development mode.
 */
export async function devLogin(req: Request, res: Response): Promise<void> {
  console.log(req.ip);
  console.log(req.hostname);
  if (config.util.getEnv("NODE_ENV") === "development" && req.hostname === "localhost") {
    const user = await User.findOne({ id: 1  });
    const login = util.promisify(req.login);
    if (user) {
      login(user);
      req.flash("success", `Ingelogd als ${user.name}`);
    } else {
      req.flash("fout", "Gebruiker met id 1 bestaat niet, dus we konden je niet inloggen.");
    }
    res.redirect("/");
  } else {
    throw new Error("Somebody tried to access devLogin, help!");
  }
}
