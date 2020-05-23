import { launch, TestInstance } from "./helper";
import { factory } from "../factory";

let t: TestInstance;
beforeAll(async () => {
  t = await launch();
});

afterAll(async () => {
  await t.server.close();
});

test("create valid store", async () => {
  const store = await factory.store.create();
  expect(store.id).toBeDefined();
});

test("get store index", async () => {
  const stores = await factory.store.createAmount(10);
  const resp = await t.app.get("/winkels");
  expect(resp.status).toBe(200);
  for(const store of stores) {
    expect(resp.data).toContain(store.name);
  }
});

test("get store show", async () => {
  const store = await factory.store.create();
  const resp = await t.app.get(`/winkels/${ store.id }`);
  expect(resp.status).toBe(200);
  expect(resp.data).toContain(store.description);
});

test("should get 404", async () => {
  const resp = await t.app.get("/winkels/999999");
  expect(resp.status).toBe(404);
});
