import test from "ava";
import request from "supertest";

import spawn from  "../app";

test("should get homepage", async t => {
  const app = await spawn({ environment: "test" });
  const resp = await request(app).get("/");
  t.is(resp.status, 200);
});
