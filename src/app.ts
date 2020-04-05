import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import path from "path";

const app = express();

import * as home from "./controllers/home";

/**
 * Configuration
 */
app.set("port", 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

/**
 * Create database connection
 */
createConnection();


/**
 * App Routes
 */
app.get("/", home.index);

export default app;
