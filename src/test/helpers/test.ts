import avaTest, { ExecutionContext, TestInterface } from "ava";
import spawn from  "../../app";
import request, { SuperTest, Test } from "supertest";

export interface Context {
    request: SuperTest<Test>;
}

const test = avaTest as TestInterface<Context>;

test.before(async (t: ExecutionContext<Context>) => {
  const app = await spawn();
  t.context = { request: request(app) };
});

export default test;