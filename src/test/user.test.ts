import { TestInstance } from "./helper";
import { factory } from "../factory";
import * as faker from "faker";

let t: TestInstance;
beforeAll(async () => {
  t = await TestInstance.launch();
});

beforeEach(async () => await t.resetClient());

afterAll(() => {
  t.closeServer();
});

test("redirected unauthorized users to login", async () => {
  const respIndex = await t.client.get("./users/");
  expect(respIndex).toRedirectTo("/login");

  const user = await factory.user.create();
  const respShow = await t.client.get(`./users/${ user.id }`);
  expect(respShow).toRedirectTo("/login");

  const oldName = user.name;
  const newName = faker.internet.userName();

  const respUpdate = await t.client.post(`./users/${ user.id }`, { form: { name: newName, email: user.email } });
  expect(respUpdate).toRedirectTo("/login");

  expect(user.name).toBe(oldName);
});

test("respond to non-admin users with 404", async () => {
  await t.login(await factory.user.create());

  const respIndex = await t.client.get("./users/");
  expect(respIndex.statusCode).toBe(404);

  const user = await factory.user.create();
  const respShow = await t.client.get(`./users/${ user.id }`);
  expect(respShow.statusCode).toBe(404);

  const oldName = user.name;
  const newName = faker.internet.userName();

  const respUpdate = await t.client.post(`./users/${ user.id }`, { form: { name: newName, email: user.email } });
  expect(respUpdate.statusCode).toBe(404);
  await user.reload();
  expect(user.name).toBe(oldName);
});

test("user index", async () => {
  const admin = await factory.user.create({ admin: true });
  const users = await factory.user.createAmount(5);
  await t.login(admin);

  const resp = await t.client.get("./users/");
  expect(resp.statusCode).toBe(200);
  expect(resp.body).toContain(admin.email);
  for(const user of users) {
    expect(resp.body).toContain(user.email);
  }
});

test("user show", async () => {
  const admin = await factory.user.create({ admin: true });
  const user = await factory.user.create();
  await t.login(admin);

  const resp = await t.client.get(`./users/${ user.id }`);
  expect(resp.statusCode).toBe(200);
  expect(resp.body).toContain(user.email);
});

test("user update name", async () => {
  const admin = await factory.user.create({ admin: true });
  const user = await factory.user.create();
  await t.login(admin);

  const oldEmail = user.email;
  const newName = faker.internet.userName();

  const resp = await t.client.post(`./users/${ user.id }`, { form: { name: newName, email: user.email } });
  expect(resp.statusCode).toBe(200);
  expect(resp.body).toContain(user.email);
  expect(resp.body).toContain(newName);

  await user.reload();
  expect(user.email).toBe(oldEmail);
  expect(user.name).toBe(newName);
  expect(user.admin).toBe(false);
});

test("user update email", async () => {
  const admin = await factory.user.create({ admin: true });
  const user = await factory.user.create();
  await t.login(admin);

  const newEmail = faker.internet.email();
  const oldName = user.name;

  const resp = await t.client.post(`./users/${ user.id }`, { form: { name: oldName, email: newEmail } });
  expect(resp.statusCode).toBe(200);
  expect(resp.body).toContain(newEmail);
  expect(resp.body).toContain(oldName);

  await user.reload();
  expect(user.email).toBe(newEmail);
  expect(user.emailConfirmed).toBe(true);
  expect(user.name).toBe(oldName);
  expect(user.admin).toBe(false);
});

test("user update admin", async () => {
  const admin = await factory.user.create({ admin: true });
  const user = await factory.user.create();
  await t.login(admin);

  const oldEmail = user.email;
  const oldName = user.name;

  const resp = await t.client.post(`./users/${ user.id }`, { form: { name: oldName, email: oldEmail, admin: "on" } });
  expect(resp.statusCode).toBe(200);
  expect(resp.body).toContain(oldEmail);
  expect(resp.body).toContain(oldName);

  await user.reload();
  expect(user.email).toBe(oldEmail);
  expect(user.name).toBe(oldName);
  expect(user.admin).toBe(true);
});

