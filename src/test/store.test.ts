import test from "ava";
import request from "supertest";

import app from "./helpers/app";

test("get store index", async t => {
  const resp = await request(await app()).get("/winkels");
  t.is(resp.status, 200);
});

// TODO: This test does a timeout because stores don't have a 404.
test.skip("get store show", async t => {
  const resp = await request(await app()).get("/winkels/1");
  t.is(resp.status, 200);
});
