import test from "ava";
import request from "supertest";

import app from "./helpers/app";

test("get tag index", async t => {
  const resp = await request(await app()).get("/tags");
  t.is(resp.status, 200);
});

// We need to seed the tests...
test.skip("get tag show", async t => {
  const resp = await request(await app()).get("/tag/1");
  t.is(resp.status, 200);
});
