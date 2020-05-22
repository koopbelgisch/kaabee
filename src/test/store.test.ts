import test from "./helpers/test";

test("get store index", async t => {
  const resp = await t.context.app.get("/winkels");
  t.is(resp.status, 200);
});

test.skip("get store show", async t => {
  const resp = await t.context.app.get("/winkels/1");
  t.is(resp.status, 200);
});
