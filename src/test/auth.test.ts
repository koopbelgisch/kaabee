import test from "./helpers/test";

test("get login page", async t => {
  const resp = await t.context.request.get("/login");
  t.is(resp.status, 200);
});

test("get login with google", async t => {
  const resp = await t.context.request.get("/auth/google/login");
  t.is(resp.status, 302);
});
