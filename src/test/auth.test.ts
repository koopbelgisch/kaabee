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

test("get login page", async () => {
  const resp = await t.client.get("./login");
  expect(resp.statusCode).toBe(200);
});

test("redirect to google", async () => {
  const resp = await t.client.get("./auth/google/login");
  expect(resp.statusCode).toBe(302);
  expect(resp.headers["location"]).toContain("google.com");
});

test("get login with facebook", async () => {
  const resp = await t.client.get("./auth/facebook/login");
  expect(resp.statusCode).toBe(302);
  expect(resp.headers["location"]).toContain("facebook.com");
});

test("email check", async () => {
  // login without email
  const user = await factory.user.create({ email: null });
  await t.login(user);

  const resp = await t.client.get("./auth/email/check");
  expect(resp.statusCode).toBe(200); // request to give email
  expect(resp.body).toContain("<form");
});

test("email submit", async () => {
  // login without email
  const user = await factory.user.create({ email: null });
  await t.login(user);

  const resp = await t.client.post("./auth/email/submit", { form: { email: "email@example.com" } });
  expect(resp.statusCode).toBe(302);
  expect(resp.headers["location"]).toBe("/auth/email/wait");
});

