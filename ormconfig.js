const config = require("config");

module.exports = {
  "type": "sqlite",
  "database": config.get("database.location"),
  "synchronize": config.get("database.synchronize"),
  "logging": config.get("database.logging"),
  "entities": [
    "dist/models/**/*.js"
  ],
  "migrations": [
    "db/migrations/**/*.ts"
  ],
  "cli": {
    "entitiesDir": "src/models",
    "migrationsDir": "src/migration"
  }
}
