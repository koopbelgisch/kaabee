import { promisify } from "util";
import * as crypto from "crypto";

export const randomBytes = promisify(crypto.randomBytes);

export async function randomURLSafe(length: number): Promise<string> {
  let buffer;
  do {
    buffer = await crypto.randomBytes(length)
      .toString("base64")
      .replace("+", "-")
      .replace("/", "_")
      .replace("=", "");
  } while(buffer.length > length);
  return buffer;
}
