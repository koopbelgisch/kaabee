///<reference types="../typings/nodemailer-stub" />
import { interactsWithMail as iwm } from "nodemailer-stub";
import { TestInstance } from "./helper";
import { factory } from "../factory";
import faker from "faker";

let t: TestInstance;
beforeAll(async () => {
  t = await TestInstance.launch();
});

beforeEach(async () => await t.resetClient());

afterEach(() => iwm.flushMails());

afterAll(() => {
  t.closeServer();
});

test("get login page", async () => {
  const resp = await t.client.get("./login");
  expect(resp.statusCode).toBe(200);
});

test("redirect to google", async () => {
  const resp = await t.client.get("./auth/google/login");
  expect(resp.statusCode).toBe(302);
  expect(resp.headers["location"]).toContain("google.com");
});

test("get login with facebook", async () => {
  const resp = await t.client.get("./auth/facebook/login");
  expect(resp.statusCode).toBe(302);
  expect(resp.headers["location"]).toContain("facebook.com");
});

test("email check without login", async () => {
  const resp = await t.client.get("./auth/email/check");
  expect(resp).toRedirectTo("/login");
});


test("email check without email", async () => {
  const user = await factory.user.create({ email: null });
  await t.login(user);

  const resp = await t.client.get("./auth/email/check");
  expect(resp.statusCode).toBe(200); // request to give email
  expect(resp.body).toContain("<form");
});

test("email check with unconfirmed email", async () => {
  const user = await factory.user.create({ emailConfirmed: false });
  await t.login(user);

  const resp = await t.client.get("./auth/email/check");
  expect(resp.statusCode).toBe(200); // request to give email
  expect(resp.body).toContain("<form");
  expect(resp.body).toContain(user.email);
});

test("email check with confirmed email", async () => {
  const user = await factory.user.create();
  await t.login(user);

  const resp = await t.client.get("./auth/email/check");
  expect(resp).toRedirectTo("/");
});

test("email confirmation happy flow", async () => {
  // login without email
  const user = await factory.user.create({ email: null });
  const email = faker.internet.email();
  await t.login(user);

  // submit email form confirmation
  const resp = await t.client.post("./auth/email/submit", { form: { email } });
  expect(resp).toRedirectTo("/auth/email/wait");

  // emailToConfirm should be set
  await user.reload();
  expect(user.email).toBe(null);
  expect(user.emailToConfirm).toBe(email);
  expect(user.emailConfirmed).toBe(false);
  expect(user.emailToken).toBeDefined();

  // check the incoming email
  expect(iwm.sentMailsCount()).toBe(1);
  const mail = iwm.lastMail();
  expect(mail.from).toBe("info@kaabee.be");
  expect(mail.to).toStrictEqual([email]);
  expect(mail.content).toContain("Bevestig je email bij Kaabee");
  const content = mail.content;
  const urls = /<a href="([^"]+)"/.exec(content) as RegExpExecArray;
  expect(urls.length).toBe(2);

  const confirmationUrl = urls[1];
  expect(confirmationUrl).toContain("/auth/email/confirm/");
  expect(confirmationUrl).toContain(user.emailToken);

  // GET confirmation url
  const confirmResp = await t.client.get(confirmationUrl, { prefixUrl: "" });
  expect(confirmResp).toRedirectTo("/");

  // email should be set
  await user.reload();
  expect(user.email).toBe(email);
  expect(user.emailConfirmed).toBe(true);
  expect(user.emailToken).toBe(null);
  expect(user.emailToConfirm).toBe(null);
});

test("email confirmation link expired", async () => {
  // login without email
  const user = await factory.user.create({ email: null });
  const email = faker.internet.email();
  await t.login(user);

  // submit email form confirmation
  const resp = await t.client.post("./auth/email/submit", { form: { email } });
  expect(resp).toRedirectTo("/auth/email/wait");

  // expire token
  await user.reload();
  user.emailTokenExpiry = Date.now() - 1;
  await user.save();

  const confirmResp = await t.client.get(`./auth/email/confirm/${ user.emailToken }`);
  expect(confirmResp).toRedirectTo("/");

  await user.reload();
  expect(user.emailConfirmed).toBe(false);
});

test("email confirmation  wrong link", async () => {
  // login without email
  const user = await factory.user.create({ email: null });
  const email = faker.internet.email();
  await t.login(user);

  // submit email form confirmation
  const resp = await t.client.post("./auth/email/submit", { form: { email } });
  expect(resp).toRedirectTo("/auth/email/wait");

  const confirmResp = await t.client.get("./auth/email/confirm/aaaaaaaaaaaaaa");
  expect(confirmResp).toRedirectTo("/");

  await user.reload();
  expect(user.emailConfirmed).toBe(false);
  expect(user.emailToken).toBeDefined();
});

test("email change happy flow", async () => {
  // login with an existing email
  const user = await factory.user.create();
  const oldEmail = user.email;
  const email = faker.internet.email();
  await t.login(user);

  // check if email is confirmed
  const check = await t.client.get("./auth/email/check");
  expect(check).toRedirectTo("/");

  // submit email form confirmation
  const resp = await t.client.post("./auth/email/submit", { form: { email } });
  expect(resp).toRedirectTo("/auth/email/wait");

  // emailToConfirm should be set
  await user.reload();
  expect(user.email).toBe(oldEmail);
  expect(user.emailToConfirm).toBe(email);
  expect(user.emailConfirmed).toBe(true);
  expect(user.emailToken).toBeDefined();

  // check the incoming email
  expect(iwm.sentMailsCount()).toBe(1);
  const mail = iwm.lastMail();
  expect(mail.from).toBe("info@kaabee.be");
  expect(mail.to).toStrictEqual([email]);
  expect(mail.content).toContain("Bevestig je email bij Kaabee");
  const content = mail.content;
  const urls = /<a href="([^"]+)"/.exec(content) as RegExpExecArray;
  expect(urls.length).toBe(2);

  const confirmationUrl = urls[1];
  expect(confirmationUrl).toContain("/auth/email/confirm/");
  expect(confirmationUrl).toContain(user.emailToken);

  // GET confirmation url
  const confirmResp = await t.client.get(confirmationUrl, { prefixUrl: "" });
  expect(confirmResp).toRedirectTo("/");

  // email should be set
  await user.reload();
  expect(user.email).toBe(email);
  expect(user.emailConfirmed).toBe(true);
  expect(user.emailToken).toBe(null);
  expect(user.emailToConfirm).toBe(null);
});