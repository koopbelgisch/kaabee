import { Request, Response } from "express";
import { getManager, getRepository } from "typeorm";
import { Store } from "../models/store";

/**
 * GET /winkels
 * Shows all stores
 */
export async function getStores(req: Request, res: Response): Promise<void> {
  const stores = await getManager().find(Store);
  res.render("pages/stores", { stores: stores });
}

/**
 * GET /stores/:storeid
 * Shows page for store with given id
 */
export async function getStore(req: Request, res: Response): Promise<void> {
  const store = await getRepository(Store).findOne(req.params["storeId"]);
  if (store !== undefined) {
    const tags = await store.tags;
    res.render("pages/store", { store: store, tags: tags });
  }
}

/**
 * POST /stores
 * Adds new store in database
 */
export async function addStore(req: Request, res: Response): Promise<void> {
  console.log("Adding store:", req.body);
}
