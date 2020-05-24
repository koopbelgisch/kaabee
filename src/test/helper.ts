import { CookieJar } from "tough-cookie";
import got, { Got } from "got";
import http from "http";
import listen from "test-listen";

import spawn from "../app";
import { User } from "../models/user";

export class TestInstance {

  public static async launch(): Promise<TestInstance> {
    const server = http.createServer(await spawn());
    const url = await listen(server);
    const cookieJar = new CookieJar();
    const client = got.extend({
      prefixUrl: url,
      throwHttpErrors: false,
      followRedirect: false,
      timeout: 500,
      cookieJar,
    });

    return new TestInstance(client, server);
  }

  constructor(public client: Got, private server: http.Server) {}

  public async login(user: User): Promise<void> {
    const resp = await this.client.get(`./auth/dev/login?id=${ user.id }`);
    expect(resp.statusCode).toBe(302);
    expect(resp.headers["location"]).toBe("/");
  }

  public close(): void {
    this.server.close();
  }
}


