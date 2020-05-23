import { launch, TestInstance } from "./helper";

let t: TestInstance;
beforeAll(async () => {
  t = await launch();
});

afterAll(async () => {
  await t.server.close();
});

test("get login page", async () => {
  const resp = await t.app.get("/login");
  t.is(resp.status, 200);
});

test("get login with google", async () => {
  const resp = await t.app.get("/auth/google/login");
  t.is(resp.status, 302);
});

test("get login with facebook", async () => {
  const resp = await t.app.get("/auth/facebook/login");
  t.is(resp.status, 302);
});
