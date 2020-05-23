import { launch, TestInstance } from "./helper";

let t: TestInstance;
beforeAll(async () => {
  t = await launch();
});

afterAll(async () => {
  await t.server.close();
});


test("get tag index", async () => {
  const resp = await t.app.get("/tags");
  expect(resp.status).toBe(200);
});

test("get tag show", async () => {
  const resp = await t.app.get("/tag/1");
  expect(resp.status).toBe(200);
});
