import axios, { AxiosInstance } from "axios";
import http from "http";
import listen from "test-listen";

import spawn from "../app";

export interface TestInstance {
  app: AxiosInstance;
  server: http.Server;
}

export async function launch(): Promise<TestInstance> {
  const server = http.createServer(await spawn());
  const url = await listen(server);
  const app = axios.create({
    baseURL: url,
    maxRedirects: 0,
    timeout: 2000,
    validateStatus: () => true,
  });

  return { server, app };
}
