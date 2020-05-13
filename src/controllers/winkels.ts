import { Request, Response } from "express";
import { getManager, getRepository } from "typeorm";
import { Store } from "../models/store";
import { Tag } from "../models/tag";

/**
 * GET /winkels
 * Shows all stores
 */
export async function getStores(req: Request, res: Response): Promise<void> {
  const stores = await getManager().find(Store);
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

/**
 * Show the update page for stores
 */
export async function editStore(req: Request, res: Response): Promise<void> {
  const store = await Store.findOne(req.params["storeId"]);
  if (store !== undefined) {
    const tags = await store.tags;
    const allTags =  await Tag.find();
    res.render("store/adapt", { store: store, tags: tags, allTags: allTags });
  }
}

/**
 * POST /winkels/:storeId/update
 * Update a store in database.
 * Uses POST, PATCH does not work with forms.
 */
export async function updateStore(req: Request, res: Response): Promise<void> {
  const store = await Store.findOne(req.params["storeId"]);

  if (store !== undefined) {
    store.name = req.body["Name"];
    store.description = req.body["Description"];
    store.postcode = req.body["Postcode"];
    store.site = req.body["Site"];
    store.email = req.body["Email"];

    const allTags =  await Tag.find();
    const checkedTags = allTags.filter(t => Object.keys(req.body).indexOf(t.name) > -1);
    store.tags = Promise.resolve(checkedTags);

    await Store.save(store);
    res.render("store/show", { store: store, tags: checkedTags });
  }
}

