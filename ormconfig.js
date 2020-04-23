const config = require("config");

module.exports = {
  "type": "sqlite",
  "database": config.get("database.location"),
  "synchronize": config.get("database.synchronize"),
  "logging": config.get("database.logging"),
  "entities": [
    "src/models/**/*.ts"
  ],
  "migrations": [
    "db/migrations/**/*.ts"
  ],
  "cli": {
    "entitiesDir": "src/models",
    "migrationsDir": "src/migration"
  }
}
