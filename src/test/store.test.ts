import { TestInstance } from "./helper";
import { factory } from "../factory";

let t: TestInstance;
beforeAll(async () => {
  t = await TestInstance.launch();
});

beforeEach(async () => await t.resetClient());

afterAll(() => {
  t.closeServer();
});

test("create valid store", async () => {
  const store = await factory.store.create();
  expect(store.id).toBeDefined();
});

test("get store index", async () => {
  const stores = await factory.store.createAmount(10);
  const resp = await t.client.get("./winkels");
  expect(resp.statusCode).toBe(200);
  for(const store of stores) {
    expect(resp.body).toContain(store.name);
  }
});

test("get store show", async () => {
  const store = await factory.store.create();
  const resp = await t.client.get(`./winkels/${ store.id }`);
  expect(resp.statusCode).toBe(200);
  expect(resp.body).toContain(store.description);
});

test("should get 404", async () => {
  const resp = await t.client.get("./winkels/999999");
  expect(resp.statusCode).toBe(404);
});
