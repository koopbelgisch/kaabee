import { Request, Response } from "express";
import { Store } from "../models/store";

/**
 * GET /
 * Home page.
 */
export async function index(req: Request, res: Response): Promise<void> {
  res.render("home", {
    title: "KaaBee",
    flash: req.flash,
    currentUser: req.user,
    storeCount: await Store.count(),
  });
}
