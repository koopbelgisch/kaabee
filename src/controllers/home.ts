import { Request, Response } from "express";
import { Store } from "../models/store";

/**
 * GET /
 * Home page.
 */
export async function index(req: Request, res: Response): Promise<void> {
  res.render("home/index", {
    title: "KaaBee",
    storeCount: await Store.count(),
  });
}
