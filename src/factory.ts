import { BaseEntity } from "typeorm";
import * as faker from "faker";

import { Store } from "./models/store";
import { Tag } from "./models/tag";
import { User } from "./models/user";


function vatnumber(): string {
  return faker.random.number(1999).toString().padStart(4, "0") + "."
    + faker.random.number(999).toString().padStart(3, "0") + "."
    + faker.random.number(999).toString().padStart(3, "0");
}

class Factory<T extends BaseEntity> {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private builder: (opts?: any) => T) {}

  build(opts = {}): T {
    return this.builder(opts);
  }

  async createAmount(amount: number, opts = {}): Promise<T[]> {
    return Promise.all(new Array(amount).fill(undefined).map(() => this.create(opts)));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createMany(optsArr: Array<any>): Promise<T[]> {
    return Promise.all(optsArr.map(opts => this.create(opts)));
  }

  async create(opts = {}): Promise<T> {
    const model = this.build(opts);
    await model.save();
    return model;
  }
}

function definedOr<T>(item: T | undefined, generator: () => T): T {
  if (item !== undefined) {
    return item;
  } else {
    return generator();
  }
}

export const factory = {

  tag: new Factory(opts  => {
    const tag = new Tag();
    tag.name = opts.name || faker.commerce.department();
    return tag;
  }),

  store: new Factory(opts => {
    let tags: Tag[] = [];
    if (opts.tags) {
      tags = opts.tags;
    } else if (opts.possibleTags) {
      tags = [opts.possibleTags[Math.floor(Math.random() * opts.possibleTags.length)]];
    }
    const store = new Store();
    store.name = definedOr(opts.name, faker.company.companyName);
    store.description = definedOr(opts.description, faker.company.catchPhrase);
    store.vatnumber = definedOr(opts.vatnumber, vatnumber);
    store.postcode = definedOr(opts.postcode, () => faker.random.number(9999).toString());
    store.email = definedOr(opts.email, faker.internet.email);
    store.logopath = definedOr(opts.logopath, () => "/logos/test.png");
    store.site = definedOr(opts.site, faker.internet.url);
    store.tags = Promise.resolve(tags);
    return store;
  }),

  user: new Factory(opts => {
    const user = new User();
    user.name = definedOr(opts.name, faker.internet.userName);
    user.admin = definedOr(opts.admin, () => false);
    user.email = definedOr(opts.email, faker.internet.email);
    user.emailConfirmed = definedOr(opts.emailConfirmed, () => false);
    user.provider = definedOr(opts.provider, () => faker.random.boolean() ? "facebook" : "google");
    user.providerId = definedOr(opts.providerId, faker.random.uuid);
    return user;
  })
};

