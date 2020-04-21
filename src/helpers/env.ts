import config from "config";

export class Environment {

  public readonly environment: string;

  constructor() {
    this.environment = config.util.getEnv("NODE_ENV") || "development";
  }

  get isDev(): boolean {
    return this.environment.startsWith("dev");
  }

  get isDevelop(): boolean {
    return this.isDev;
  }

  get isDevelopment(): boolean {
    return this.isDev;
  }

  get isTest(): boolean {
    return this.environment.startsWith("test");
  }

  get isProd(): boolean {
    return !this.isDev && !this.isTest;
  }

}

const env = new Environment();

export default env;
