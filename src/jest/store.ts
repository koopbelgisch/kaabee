import { launch, TestInstance } from "./helper";

let t: TestInstance;
beforeAll(async () => {
  t = await launch();
});

afterAll(async () => {
  await t.server.close();
});

test("get store index", async () => {
  const resp = await t.app.get("/winkels");
  expect(resp.status).toBe(200);
});

test.skip("get store show", async () => {
  const resp = await t.app.get("/winkels/1");
  expect(resp.status).toBe(200);
});
