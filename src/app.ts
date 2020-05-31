import "reflect-metadata";
import express, { Express } from "express";
import cookieSession from "cookie-session";
import { createConnection } from "typeorm";
import flash from "connect-flash";
import config from "config";
import path from "path";
import passport from "passport";

import env from "./helpers/env";

import * as home from "./controllers/home";
import * as winkels from "./controllers/winkels";
import * as tags from "./controllers/tags";
import * as auth from "./controllers/auth";
import * as users from "./controllers/users";

export default async function spawn(): Promise<Express> {

  /**
   * Setup database connection
   */
  await createConnection();

  // Create express app
  const app = express();

  /**
   * Configuration
   */

  app.set("port", config.get("app.port"));
  app.set("views", path.join(__dirname, "../views"));
  app.set("view engine", "pug");

  app.use("/logos", express.static(path.join(__dirname, "..", "data", "logos")));

  // Parse request bodies
  app.use(express.urlencoded({ extended: true }));

  // Allows the use of req.flash for passing messages.
  app.use(flash());

  // Use cookies to store the session
  app.use(cookieSession({
    name: "kaabee.session",
    secret: config.get("secrets.cookieSecret"),
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: "lax",
  }));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Make useful variables available in the views
  app.use((req, res, next) => {
    const port = req.socket.localPort;
    req.baseUrl = `${ req.protocol }://${ req.hostname }${ port === 443 ? "" : ":" + port }`;
    res.locals.currentUser = req.user;
    res.locals.flash = req.flash();
    res.locals.env = env;
    next();
  });

  /**
   * Static public dir
   */
  app.use(express.static(path.join(__dirname, "../public")));

  /**
   * App Routes
   */

  // Authentication
  app.get("/login", auth.login);
  app.get("/logout", auth.logout);
  app.get("/auth/google/login", passport.authenticate("google"));
  app.get(
    "/auth/google/return",
    passport.authenticate(
      "google",
      { failureRedirect: "/login",
        failureFlash: true,
        successRedirect: "/auth/email/check",
        successFlash: "Je bent aangemeld!"
      })
  );
  app.get("/auth/facebook/login", passport.authenticate("facebook"));
  app.get(
    "/auth/facebook/return",
    passport.authenticate(
      "facebook",
      { failureRedirect: "/login",
        failureFlash: true,
        successRedirect: "/auth/email/check",
      })
  );

  app.get("/auth/email/check", auth.emailCheck);
  app.post("/auth/email/submit", auth.emailSubmit);
  app.get("/auth/email/wait", auth.emailWaiting);
  app.get("/auth/email/confirm/:token", auth.emailConfirm);

  if (env.isDev || env.isTest) {
    app.get("/auth/dev/login", auth.devLogin);
  }

  // Home page
  app.get("/", home.index);

  // Winkels
  app.get("/winkels", winkels.getStores);
  app.get("/winkels/:storeId", winkels.getStore);
  app.post("/winkels", winkels.addStore);

  // Tags
  app.get("/tags", tags.getTags);
  app.get("/tags/:tagId", tags.getTag);

  // Users
  app.get("/users", users.index);
  app.get("/users/:userId", users.show);

  return app;
}
