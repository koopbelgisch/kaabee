import { Request, Response } from "express";
import { Brackets } from "typeorm";
import { Store } from "../models/store";
import { Tag } from "../models/tag";

/**
 * GET /winkels
 * Shows all stores
 */
export async function getStores(req: Request, res: Response): Promise<void> {
  let query = Store.createQueryBuilder("store");
  const formData = {
    nameDesc: "",
    postal: "",
    tag: ""
  }; // Used to prevent form from being emptied after refresh

  if (Object.keys(req.query).length !== 0) {
    // A search query was passed
    if (req.query.name_desc) {
      query = query.where(new Brackets(qb => {
        qb.where("store.name like :name", { name: "%" + req.query.name_desc + "%" })
          .orWhere("store.description like :desc", { desc: "%" + req.query.name_desc + "%" });
      }));
      formData.nameDesc = req.query.name_desc.toString();
    }

    if (req.query.postal) {
      query = query.andWhere("store.postcode = :postcode", { postcode: req.query.postal });
      formData.postal = req.query.postal.toString();
    }

    if (req.query.tag) {
      query = query.leftJoinAndSelect("store.tags", "tag");
      if (Array.isArray(req.query.tag)) {
        // Multiple tags were given
        query = query.where(new Brackets(qb => {
          (req.query.tag! as string[]).forEach((t: string, i: number) => {
            let res = qb;
            res = res.orWhere(`tag.id = :tag${i}`, { [`tag${i}`]: t });
            return res;
          });
          return qb;
        }));
        query = query.groupBy("store.id").having("count(*) = :length", { length: req.query.tag.length });
      } else {
        // Single tag was given
        query = query.andWhere("tag.id = :tag", { tag: req.query.tag });
      }
      formData.tag = req.query.tag.toString();
    }
  }

  const stores = await query.getMany();
  const tags = await Tag.find();
  res.render("store/index", { stores, tags, formData });
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
  } else {
    res.status(404);
    res.send("Not found");
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

