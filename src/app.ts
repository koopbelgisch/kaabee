import "reflect-metadata";
import express, { Express } from "express";
import { createConnection } from "typeorm";
import config from "config";
import path from "path";

import * as home from "./controllers/home";
import * as winkels from "./controllers/winkels";
import * as tags from "./controllers/tags";

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

  /**
   * App Routes
   */
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
