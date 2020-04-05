import "reflect-metadata";
import * as faker from "faker";
import { createConnection } from "typeorm";
import { Store } from "./models/store";



async function seed(): Promise<void> {
  await createConnection();

  // Create some fake stores
  const stores =
    await Promise.all(new Array(1000).fill(undefined).map(async () => {
      const store = new Store();
      store.name = faker.company.companyName();
      store.description = faker.company.catchPhrase();
      store.postcode = faker.random.number(9999).toString();
      await store.save();
      return store;
    }));
  console.dir(stores);
}


seed();
