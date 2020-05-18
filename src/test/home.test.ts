import test from "./helpers/test";

test("get homepage", async t => {
  const resp = await t.context.app.get("/");
  t.is(200, resp.status);
});
