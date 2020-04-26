import spawn from  "../../app";
import { Express } from "express";

let _app: Express | null = null;
export default async function app(): Promise<Express> {
  if (_app === null) {
    _app = await spawn();
  }
  return _app;
}

