import test from "./helpers/test";

test("get tag index", async t => {
  const resp = await t.context.request.get("/tags");
  t.is(resp.status, 200);
});

// We need to seed the tests...
test.skip("get tag show", async t => {
  const resp = await t.context.request.get("/tag/1");
  t.is(resp.status, 200);
});
