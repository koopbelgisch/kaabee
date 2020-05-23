import "reflect-metadata";
import { createConnection } from "typeorm";
import { factory } from "./factory";


async function seed(): Promise<void> {
  await createConnection();

  // Create some fake tags
  const tagNames = ["voeding", "doe-het-zelf", "apotheek"];
  const tags = await factory.tag.createMany(tagNames.map(name => {return { name };}));

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
