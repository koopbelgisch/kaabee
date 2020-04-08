import { Request, Response } from "express";

/**
 * GET /winkels
 * Shows all stores
 */
export async function getStores(req: Request, res: Response): Promise<void> {
  res.render("stores");
}

/**
 * GET /stores/:storeid
 * Shows page for store with given id
 */
export async function getStore(req: Request, res: Response): Promise<void> {
  res.render("store", {
    name: req.params["storeId"]
  });
}

/**
 * POST /stores
 * Adds new store in database
 */
export async function addStore(req: Request, res: Response): Promise<void> {
  console.log("Adding store:", req.body);
}
