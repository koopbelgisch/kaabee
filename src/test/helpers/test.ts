import avaTest, { ExecutionContext, TestInterface } from "ava";
import axios, { AxiosInstance } from "axios";
import http from "http";
import listen from "test-listen";
import spawn from  "../../app";

export interface Context {
    app: AxiosInstance;
    server: http.Server;
}

const test = avaTest as TestInterface<Context>;

test.beforeEach(async (t: ExecutionContext<Context>) => {
  const server = http.createServer(await spawn());
  const url = await listen(server);
  const app = axios.create({
    baseURL: url,
    maxRedirects: 0,
    validateStatus: () => true,
  });
  t.context = { server, app };
});

test.afterEach.always(t => {
  t.context.server.close();
});

export default test;
