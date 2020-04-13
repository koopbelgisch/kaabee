/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Store } from "./models/store";
import { Tag } from "./models/tag";
import * as fs from "fs";
import csv from "csv-parser";

async function addTags(tagNames: string[]): Promise<Tag[]> {
  return await Promise.all(tagNames.map(async name => {
    const tag = new Tag();
    tag.name = name;
    await tag.save();
    return tag;
  }));
}

async function addStores(storeRecords: Record<string, any>[], tags: Tag[]): Promise<Store[]>{
  return await Promise.all(storeRecords.map(async storeRecord => {
    const store = new Store();
    store.name = storeRecord["Winkel"];
    store.description = "";
    store.vatnumber = storeRecord["Ondernemingsnummer"];
    store.postcode = storeRecord["Postcode / Gemeente"];
    store.tags = Promise.resolve(tags.filter(tag => tag.name === storeRecord["Categorie"]));
    await store.save();
    return store;
  }));
}

async function processData(results: Record<string, any>[]): Promise<void> {
  await createConnection();

  // The last entry is empty & undefined
  const res = results.slice(0, -1);

  const tagNames: string[] = res.filter((val: Record<string, any>) => {
    return val["Categorie"] !== undefined && val["Categorie"].length > 0;
  }).map((val: Record<string, any>) => val["Categorie"]);

  const uniqueTagNames: string[] = Array.from(new Set(tagNames));
  const tags: Tag[] = await addTags(uniqueTagNames);
  await addStores(res, tags);

  console.log("Done");
}

async function seedActualStores(): Promise<void> {

  const results: Record<string, any>[] = [];
  // Read in the existing csv, first process all tagnames
  // Then process the stores (don't have descriptions yet)
  fs.createReadStream("data/data.csv")
    .pipe(csv())
    .on("data", (data: Record<string, any>) => results.push(data))
    .on("end", () => processData(results));
}


seedActualStores();
