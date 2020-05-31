import { CookieJar } from "tough-cookie";
import got, { Got, Response } from "got";
import { Express } from "express";
import http from "http";
import listen from "test-listen";

import spawn from "../app";
import { User } from "../models/user";

export class TestInstance {

  public client: Got;

  public static async launch(): Promise<TestInstance> {
    const app = await spawn();
    const server = http.createServer(app);
    const url = await listen(server);
    return new TestInstance(url, server, app);
  }

  private readonly cookieJar: CookieJar;

  constructor(
    private url: string,
    private server: http.Server,
    private app: Express
  ) {
    this.cookieJar = new CookieJar();
    this.client = got.extend({
      prefixUrl: this.url,
      throwHttpErrors: false,
      followRedirect: false,
      timeout: 50000,
      cookieJar: this.cookieJar,
    });
  }

  /**
   * Reset the client (clearing all cookies).
   */
  public async resetClient(): Promise<void> {
    await this.cookieJar.removeAllCookies();
  }

  /**
   * Send a login request to sign in as the given user.
   */
  public async login(user: User): Promise<void> {
    const resp = await this.client.get(`./auth/dev/login?id=${ user.id }`);
    expect(resp).toRedirectTo("/");
  }

  /**
   * Close the http server to the app.
   */
  public closeServer(): void {
    this.server.close();
  }
}

expect.extend({
  toRedirectTo(received: Response, expectedRedirectLocation: string, expectedStatusCode = 302) {
    if(received.statusCode == expectedStatusCode) {
      const location = received.headers["location"];
      if (location === expectedRedirectLocation) {
        return {
          message: () => `expected redirect location "${location}" not to be "${expectedRedirectLocation}`,
          pass: true
        };
      } else {
        return {
          message: () => `expected redirect location "${location}" to be "${expectedRedirectLocation}`,
          pass: false
        };
      }
    } else {
      return {
        message: () => `expected statuCode ${ received.statusCode } to be ${ expectedStatusCode }`,
        pass: false
      };
    }
  }
});


