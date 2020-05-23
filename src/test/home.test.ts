import { launch, TestInstance } from "./helper";

let t: TestInstance;
beforeAll(async () => {
  t = await launch();
});

afterAll(async () => {
  await t.server.close();
});

test("get homepage", async () => {
  const resp = await t.app.get("/");
  expect(resp.status).toBe(200);
});
