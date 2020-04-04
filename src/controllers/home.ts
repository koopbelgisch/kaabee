import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export function index(req: Request, res: Response): void {
  res.render("home", {
    title: "KaaBee"
  });
}
