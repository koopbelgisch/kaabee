import { TestInstance } from "./helper";

let t: TestInstance;
beforeAll(async () => {
  t = await TestInstance.launch();
});

afterAll(() => {
  t.close();
});

test("get homepage", async () => {
  const resp = await t.client.get("./");
  expect(resp.statusCode).toBe(200);
});
