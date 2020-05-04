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
  console.log("HERE");
  console.log("Adding store:", req.body);
}

/**
 * Show the adaptation page for stores
 */
export async function showAdaptStore(req: Request, res: Response): Promise<void> {
  const store = await getRepository(Store).findOne(req.params["storeId"]);
  if (store !== undefined) {
    const tags = await store.tags;
    const allTags =  await getManager().find(Tag);
    res.render("store/adapt", { store: store, tags: tags, allTags: allTags });
  }
}

export async function adaptStore(req: Request, res: Response): Promise<void> {
  const store = await getRepository(Store).findOne(req.params["storeId"]);

  console.log(req.body);
  console.log(Object.keys(req.body));

  if (store !== undefined) {
    store.name = req.body["Name"];
    store.description = req.body["Description"];
    store.postcode = req.body["Postcode"];
    store.site = req.body["Site"];
    store.email = req.body["Email"];

    const allTags =  await getManager().find(Tag);
    const checkedTags = await allTags.filter(t => Object.keys(req.body).indexOf(t.name) > -1);
    store.tags = Promise.resolve(checkedTags);

    await getRepository(Store).save(store);
    res.render("store/show", { store: store, tags: checkedTags });
  }
}

