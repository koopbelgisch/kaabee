import "reflect-metadata";
import * as faker from "faker";
import { createConnection } from "typeorm";
import { Store } from "./models/store";
import { Tag } from "./models/tag";
import csv = require("csv-parser");
import fs = require("fs");

function vatnumber(): string {
  return faker.random.number(1999).toString().padStart(4, "0") + "."
    + faker.random.number(999).toString().padStart(3, "0") + "."
    + faker.random.number(999).toString().padStart(3, "0");
}


async function seed(): Promise<void> {
  await createConnection();

  // Create some fake tags
  const tagNames = ["voeding", "doe-het-zelf", "apotheek"];
  const tags =
    await Promise.all(tagNames.map(async name => {
      const tag = new Tag();
      tag.name = name;
      await tag.save();
      return tag;
    }));

  // Create some fake stores
  const stores =
    await Promise.all(new Array(1000).fill(undefined).map(async () => {
      const store = new Store();
      store.name = faker.company.companyName();
      store.description = faker.company.catchPhrase();
      store.vatnumber = vatnumber();
      store.postcode = faker.random.number(9999).toString();
      store.tags = Promise.resolve([tags[Math.floor(Math.random() * tags.length)]]);
      await store.save();
      return store;
    }));
  console.dir(stores);
  console.dir(tags);
}

async function addTags(tagNames: string[]): Promise<Tag[]> {
  return await Promise.all(tagNames.map(async name => {
    const tag = new Tag();
    tag.name = name;
    await tag.save();
    return tag;
  }))
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
    return store
  }))
}

async function processData(results: Record<string, any>[]): Promise<void> {
  await createConnection();

  // The last entry is empty & undefined
  const res = results.slice(0, results.length - 1);

  const tagNames: string[] = res.filter((val: Record<string, any>) => {
    return val["Categorie"] !== undefined && val["Categorie"].length > 0
  }).map((val: Record<string, any>) => val["Categorie"]);

  const uniqueTagNames: string[] = Array.from(new Set(tagNames));
  const tags: Tag[] = await addTags(uniqueTagNames);
  const stores: Store[] = await addStores(res, tags);

  console.log("Done")
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
