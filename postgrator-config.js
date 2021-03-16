const pg = require('pg');
pg.defaults.ssl = process.env.NODE_ENV === "production";
require('dotenv').config()

//define the dependencies for postgrator to do migrations
module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL,
}