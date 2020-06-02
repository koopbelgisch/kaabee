import { Request, Response } from "express";
import { Tag } from "../models/tag";

/**
 * GET /tags
 * Shows all tags
 */
export async function getTags(req: Request, res: Response): Promise<void> {
  const tags = await Tag.find();
  res.render("tag/index", { tags: tags });
}

/**
 * GET /tags/:tagId
 * Shows all stores for tag with given id
 */
export async function getTag(req: Request, res: Response): Promise<void> {
  const tag = await Tag.findOne(req.params["tagId"]);
  if (tag !== undefined) {
    const stores = await tag.stores;
    res.render("tag/show", { tag: tag, stores: stores });
  } else {
    res.status(404);
    res.send("Not found");
  }
}
