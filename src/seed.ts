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
  const tagNames = ["voeding", "doe-het-zelf", "apotheek"]
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
      store.email = faker.internet.email();
      // Placeholder, faker.system.filePath() returns undefined
      store.logopath = store.name;
      store.site = faker.internet.url();
      store.tags = Promise.resolve([tags[Math.floor(Math.random() * tags.length)]]);

      await store.save();
      return store;
    }));
  console.dir(stores);
  console.dir(tags);
}

seed();
