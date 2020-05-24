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

test("create valid tags", async () => {
  const tag = await factory.tag.create();
  expect(tag.id).toBeDefined();
});

test("get tag index", async () => {
  const tags = await factory.tag.createAmount(10);
  const resp = await t.client.get("./tags");
  expect(resp.statusCode).toBe(200);
  for (const tag of tags) {
    expect(resp.body).toContain(tag.name);
  }
});

test("get tag show", async () => {
  const tag = await factory.tag.create();
  const resp = await t.client.get(`./tags/${ tag.id }`);
  expect(resp.statusCode).toBe(200);
  expect(resp.body).toContain(tag.name);
});

test("should get 404", async () => {
  const resp = await t.client.get("./tag/9999999");
  expect(resp.statusCode).toBe(404);
});
