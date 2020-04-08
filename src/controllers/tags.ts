import { Request, Response } from "express";

/**
 * GET /tags
 * Shows all tags
 */
export async function getTags(req: Request, res: Response): Promise<void> {
  res.render("tags");
}

/**
 * GET /tags/:tagId
 * Shows all stores for tag with given id
 */
export async function getTag(req: Request, res: Response): Promise<void> {
  res.render("tag", {
    name: req.params["tagId"]
  });
}
