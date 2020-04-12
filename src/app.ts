import "reflect-metadata";
import express, { Express } from "express";
import cookieSession from "cookie-session";
import { createConnection } from "typeorm";
import flash from "connect-flash";
import config from "config";
import path from "path";

import passport from "passport";

import * as home from "./controllers/home";
import * as winkels from "./controllers/winkels";
import * as tags from "./controllers/tags";
import * as auth from "./controllers/auth";

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
        successRedirect: "/",
        successFlash: "Je bent aangemeld!"
      })
  );

  // Home page
  app.get("/", home.index);

  // Winkels
  app.get("/winkels", winkels.getStores);
  app.get("/winkels/:storeId", winkels.getStore);
  app.post("/winkels", winkels.addStore);

  // Tags
  app.get("/tags", tags.getTags);
  app.get("/tags/:tagId", tags.getTag);

  return app;
}
