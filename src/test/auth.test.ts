import test from "ava";
import request from "supertest";

import app from "./helpers/app";

test("get login page", async t => {
  const resp = await request(await app()).get("/login");
  t.is(resp.status, 200);
});

test("get login with google", async t => {
  const resp = await request(await app()).get("/auth/google/login");
  t.is(resp.status, 302);
});
