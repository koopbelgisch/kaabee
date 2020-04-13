import test from "ava";
import request from "supertest";

import app from "./helpers/app";

test("get homepage", async t => {
  const resp = await request(await app()).get("/");
  t.is(resp.status, 200);
});
