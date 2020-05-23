import { launch, TestInstance } from "./helper";
import { factory } from "../factory";

let t: TestInstance;
beforeAll(async () => {
  t = await launch();
});

afterAll(async () => {
  await t.server.close();
});

test("create valid tags", async () => {
  const tag = await factory.tag.create();
  expect(tag.id).toBeDefined();
});

test("get tag index", async () => {
  const tags = await factory.tag.createAmount(10);
  const resp = await t.app.get("/tags");
  expect(resp.status).toBe(200);
  for (const tag of tags) {
    expect(resp.data).toContain(tag.name);
  }
});

test("get tag show", async () => {
  const tag = await factory.tag.create();
  const resp = await t.app.get(`/tags/${ tag.id }`);
  expect(resp.status).toBe(200);
  expect(resp.data).toContain(tag.name);
});

test("should get 404", async () => {
  const resp = await t.app.get("/tag/9999999");
  expect(resp.status).toBe(404);
});
