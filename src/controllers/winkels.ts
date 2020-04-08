import { Request, Response } from "express";
import { Store } from "../models/store";

/**
 * GET /winkels
 * Shows all stores
 */
export async function getStores(req: Request, res: Response): Promise<void> {
  res.render("stores");
}

export async function getStore(req: Request, res: Response): Promise<void> {
  res.render("store", {
    name: req.params["storeId"]
  });
}
