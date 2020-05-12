import test from "./helpers/test";

test("get homepage", async t => {
  const resp = await t.context.request.get("/");
  t.is(resp.status, 200);
});
