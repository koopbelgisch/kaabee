import test from "./helpers/test";

test("get store index", async t => {
  const resp = await t.context.request.get("/winkels");
  t.is(resp.status, 200);
});

// TODO: This test does a timeout because stores don't have a 404.
test.skip("get store show", async t => {
  const resp = await t.context.request.get("/winkels/1");
  t.is(resp.status, 200);
});
