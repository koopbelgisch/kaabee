import "reflect-metadata";
import express, { Express }from "express";
import { createConnection } from "typeorm";
import path from "path";

import * as home from "./controllers/home";
import * as winkels from "./controllers/winkels";
import * as tags from "./controllers/tags";

type Environment = "production" | "develop" | "test";

interface Config {
  verbose?: boolean;
  environment?: Environment;
}

export default async function spawn(config: Config = {}): Promise<Express> {

  /**
   * Setup database connection
   */
  await createConnection();

  // Create express app
  const app = express();

  /**
   * Configuration
   */
  app.set("port", 3000);
  app.set("views", path.join(__dirname, "../views"));
  app.set("view engine", "pug");

  /**
   * Static public dir
   */
  app.use(express.static(path.join(__dirname, "../public")));

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
