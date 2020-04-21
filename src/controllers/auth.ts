import config from "config";
import passport from "passport";
import { Request, Response } from "express";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth2";
import { Strategy as FacebookStrategy } from "passport-facebook";

import { User, ProviderProfile } from "../models/user";
import env from "../helpers/env";

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
    callbackize(async () => await User.findOrCreate("google", profile as ProviderProfile), callback);
  } else {
    return callback(new Error("User account is not verified."));
  }
}));

passport.use(new FacebookStrategy({
  clientID: config.get("secrets.FACEBOOK_APP_ID"),
  clientSecret: config.get("secrets.FACEBOOK_APP_SECRET"),
  callbackURL: `${config.get("app.defaultURL")}/auth/facebook/return`
},
(_at, _rt, profile, callback: VerifyCallback) => {
  callbackize(async () => await User.findOrCreate("facebook", profile as ProviderProfile), callback);
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
  res.render("auth/login", {
    title: "Login",
  });
}

/**
 * GET /logout
 *
 * Destroy the user's session.
 */
export async function logout(req: Request, res: Response): Promise<void> {
  req.logout();
  req.flash("info", "Je werd afgemeld.");
  res.redirect("/");
}

/**
 * GET /auth/email/check
 *
 * Check if a user has a registered email and handle approriately.
 */
export async function emailCheck(req: Request, res: Response): Promise<void> {
  const user = req.user as User | undefined;
  if (!user) {
    res.redirect("/login");
  } else if (user.hasConfirmedEmail()) {
    req.flash("success", "Je bent aangemeld!");
    res.redirect("/");
  } else if (user.email) {
    res.redirect("/auth/email/waitconfirm");
  } else {
    res.render("auth/emailRequest");
  }
}

/**
 * POST /auth/email/submit
 *
 * A user submits their email for cofirmation
 */
export async function emailSubmit(req: Request, res: Response): Promise<void> {
  const user = req.user as User | undefined;
  if (!user) {
    res.redirect("/login");
  } else {
    const email = req.body.email || "";
    user.email = email;
    const errors = await user.validate();
    if (errors.length > 0) {
      res.render("auth/emailRequest", { errors: errors });
    } else {
      res.redirect("/auth/email/waitconfirm");
    }
  }
}

/**
 * GET /auth/email/waiting
 *
 * A user's email is not yet confirmed. Tell them we're waiting.
 */
export async function emailWaiting(req: Request, res: Response): Promise<void> {
  const user = req.user as User | undefined;
  if (!user) {
    res.redirect("/login");
  } else if (user.hasConfirmedEmail()) {
    res.redirect("/");
  } else {
    res.render("auth/waitconfirm");
  }
}

/**
 * GET /auth/email/confirm
 *
 * A user tries to confirm their email.
 */
export async function emailConfirm(req: Request, res: Response): Promise<void> {
  const token = req.params.token;
  const user = token ? await User.findOne({ emailToken: token }) : null;
  if(user && user.emailTokenExpiry > Date.now()) {
    user.emailConfirmed = true;
    user.emailToken = undefined;
    user.emailTokenExpiry = 0;
    await user.save();
    req.flash("success", `Je e-mail '${user.email}' is bevestigd.`);
    res.redirect("/");
  } else {
    req.flash("error", "We konden je e-mail niet bevestigen. De email");
    res.redirect("/");
  }
}

/**
 * GET /auth/dev/login
 *
 * Log in as the user with id 1. Should only be available in development mode.
 */
export async function devLogin(req: Request, res: Response): Promise<void> {
  if (env.isDev && req.hostname === "localhost") {
    let user = await User.findOne({ admin: true  }); // Find a random admin user
    if (!user) {
      user = new User();
      user.name = "admin";
      user.provider = "admin";
      user.providerId = "AUTOMATISCH AANGEMAAKT";
      user.email = "admin@localhost";
      user.emailConfirmed = true;
      user.admin = true;
      await user.save();
    }
    req.login(user, () => {
      if (user) {
        req.flash("success", `Ingelogd als ${user.name}`);
      } else {
        req.flash("error", "Er liep iets mis bij het inlogen. Fix uw code.");
      }
      return res.redirect("/");
    });
  } else {
    throw new Error("Somebody tried to access devLogin, help!");
  }
}
