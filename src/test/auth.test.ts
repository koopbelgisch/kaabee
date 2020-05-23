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
  expect(resp.status).toBe(200);
});

test("login with google should redirect", async () => {
  const resp = await t.app.get("/auth/google/login");
  expect(resp.status).toBe(302);
  expect(resp.headers["location"]).toContain("google.com");
});

test("get login with facebook", async () => {
  const resp = await t.app.get("/auth/facebook/login");
  expect(resp.status).toBe(302);
  expect(resp.headers["location"]).toContain("facebook.com");
});
