import "reflect-metadata";
import express, { Express }from "express";
import { createConnection } from "typeorm";
import path from "path";

import * as home from "./controllers/home";
import * as winkels from "./controllers/winkels";

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
   * App Routes
   */
  // Home page
  app.get("/", home.index);

  // Winkels
  app.get("/winkels", winkels.getStores);
  app.get("/winkels/:storeId", winkels.getStore);

  // Tags

  return app;
}
