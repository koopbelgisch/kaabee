import { Request, Response } from "express";
import { getManager, getRepository } from "typeorm";
import { Store } from "../models/store";

/**
 * GET /winkels
 * Shows all stores
 */
export async function getStores(req: Request, res: Response): Promise<void> {
  const manager = await getManager();
  let stores;

  if (Object.keys(req.query).length !== 0) {
    // A search query was passed
    let query = manager.createQueryBuilder(Store, "store");
    if (req.query.name_desc !== undefined) {
      query = query
        .where("store.name like :name_desc", {name_desc: '%' + req.query.name_desc + '%'})
        .orWhere("store.description like :name_desc", {name_desc: '%' + req.query.name_desc + '%'});
    }
    if (req.query.postal !== undefined) {
      query = query
        .where("store.postcode = :postal", {postal: req.query.postal});
    }
    stores = await query.getMany();
  } else {
    stores = await manager.find(Store);
  }
  console.log(stores)
  res.render("store/index", { stores: stores });
}

/**
 * GET /stores/:storeid
 * Shows page for store with given id
 */
export async function getStore(req: Request, res: Response): Promise<void> {
  const store = await getRepository(Store).findOne(req.params["storeId"]);
  if (store !== undefined) {
    const tags = await store.tags;
    res.render("store/show", { store: store, tags: tags });
  }
}

/**
 * POST /stores
 * Adds new store in database
 */
export async function addStore(req: Request): Promise<void> {
  console.log("Adding store:", req.body);
}
