import test from "./helpers/test";

test("get login page", async t => {
  const resp = await t.context.app.get("/login");
  t.is(resp.status, 200);
});

test("get login with google", async t => {
  const resp = await t.context.app.get("/auth/google/login");
  t.is(resp.status, 200);
});

test("get login with facebook", async t => {
  const resp = await t.context.app.get("/auth/facebook/login");
  t.is(resp.status, 200);
});
