import "reflect-metadata";
import { createConnection } from "typeorm";
import { factory } from "./factory";


async function seed(): Promise<void> {
  await createConnection();

  // Create some fake tags
  const tagNames = [
    { "name": "Voeding", "isCategory": true },
    { "name": "Doe-het-zelf", "isCategory": true },
    { "name": "Apotheek", "isCategory": true },
    { "name": "Puur Belgisch", "isCategory": false },
    { "name": "Levert aan huis", "isCategory": false }];
  const tags = await factory.tag.createMany(tagNames);

  // Create some fake stores
  const stores = await factory.store.createAmount(1000, { possibleTags: tags });

  const users = [
    await factory.user.create({ admin: true }),
    ... await factory.user.createAmount(50)
  ];
  console.dir(stores);
  console.dir(tags);
  console.dir(users);
}

seed();
