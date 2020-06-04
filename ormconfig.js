const config = require("config");

let dir, ext;
if (process.env.NODE_ENV === "test" || process[Symbol.for("ts-node.register.instance")]) {
  // We're running in ts-node or in jest, provide ts sources.
  dir = "src";
  ext = "ts";
} else {
  // Provide compiles sources.
  dir = "dist";
  ext = "js";
}

module.exports = {
  "type": "sqlite",
  "database": config.get("database.location"),
  "synchronize": config.get("database.synchronize"),
  "logging": config.get("database.logging"),
  "entities": [
    `${ dir }/models/**/*.${ ext }`
  ],
  "cli": {
    "entitiesDir": "src/models",
    "migrationsDir": "src/migration"
  }
}
