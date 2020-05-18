import test from "./helpers/test";

test("get tag index", async t => {
  const resp = await t.context.app.get("/tags");
  t.is(resp.status, 200);
});

test("get tag show", async t => {
  const resp = await t.context.app.get("/tag/1");
  t.is(resp.status, 200);
});
