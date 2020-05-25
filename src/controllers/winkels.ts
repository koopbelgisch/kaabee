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
      formData.nameDesc = req.query.name_desc;
    }

    if (req.query.postal) {
      query = query.andWhere("store.postcode = :postcode", { postcode: req.query.postal });
      formData.postal = req.query.postal;
    }

    if (req.query.tag) {
      query = query.leftJoinAndSelect("store.tags", "tag");
      if (Array.isArray(req.query.tag)) {
        // Multiple tags were given
        query = query.where(new Brackets(qb => {
          req.query.tag.forEach((t: string, i: number) => {
            qb = qb.orWhere(`tag.id = :tag${i}`, {[`tag${i}`]: t});
          });
          return qb;
        }));
        query = query.groupBy("store.id").having(`count(*) = ${req.query.tag.length}`);
      } else {
        // Single tag was given
        query = query.andWhere("tag.id = :tag", { tag: req.query.tag });
      }
      formData.tag = req.query.tag;
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
  }
}

/**
 * POST /stores
 * Adds new store in database
 */
export async function addStore(req: Request): Promise<void> {
  console.log("Adding store:", req.body);
}
