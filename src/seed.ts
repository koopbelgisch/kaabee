import "reflect-metadata";
import * as faker from "faker";
import { createConnection } from "typeorm";
import { Store } from "./models/store";
import { Tag } from "./models/tag";

function vatnumber(): string {
  return faker.random.number(1999).toString().padStart(4, "0") + "."
    + faker.random.number(999).toString().padStart(3, "0") + "."
    + faker.random.number(999).toString().padStart(3, "0");
}


async function seed(): Promise<void> {
  await createConnection();

  // Create some fake tags
  const tagNames = [
    { "name": "Voeding", "isCategory": true },
    { "name": "Doe-het-zelf", "isCategory": true },
    { "name": "Apotheek", "isCategory": true },
    { "name": "Puur Belgisch", "isCategory": false },
    { "name": "Levert aan huis", "isCategory": false }];
  const tags =
    await Promise.all(tagNames.map(async values => {
      const tag = new Tag();
      tag.name = values.name;
      tag.isCategory = values.isCategory;
      await tag.save();
      return tag;
    }));
  // Create some fake stores
  await Promise.all(new Array(1000).fill(undefined).map(async () => {
    const store = new Store();
    store.name = faker.company.companyName();
    store.description = faker.company.catchPhrase();
    store.vatnumber = vatnumber();
    store.postcode = faker.random.number(9999).toString();
    store.email = faker.internet.email();
    // Placeholder, faker.system.filePath() returns undefined
    store.logopath = "/logos/test.png";
    store.site = faker.internet.url();
    store.tags = Promise.resolve(tags.sort(() => .5 - Math.random()).slice(0, 2));
    //store.tags = Promise.resolve([tags[Math.floor(Math.random() * tags.length)]]);
    await store.save();
    return store;
  }));
}

seed();
