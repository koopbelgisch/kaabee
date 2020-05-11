import { Request, Response } from "express";
import {Like, FindOperator} from "typeorm";
import { Store } from "../models/store";
import Dict = NodeJS.Dict;

/**
 * GET /winkels
 * Shows all stores
 */
export async function getStores(req: Request, res: Response): Promise<void> {
  let stores;

  if (Object.keys(req.query).length !== 0) {
    // A search query was passed
    let queryDict = {where: [] as Record<string, FindOperator<any>>[]};
    if (req.query.name_desc !== undefined) {
      queryDict.where.push({name: Like("%" + req.query.name_desc + "%")});
      queryDict.where.push({description: Like("%" + req.query.name_desc + "%")});
      if (req.query.postal !== undefined) {
        queryDict.where.forEach(obj => {
          obj.postcode = Like(req.query.postal)
        });
      }
    } else if (req.query.postal !== undefined) {
      queryDict.where.push({postcode: req.query.postal});
    }
    stores = await Store.find(queryDict);
  } else {
    stores = await Store.find();
  }
  res.render("store/index", { stores: stores });
}

/**
 * GET /stores/:storeid
 * Shows page for store with given id
 */
export async function getStore(req: Request, res: Response): Promise<void> {
  const store = await Store.findOne(req.params["storeId"]);
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
