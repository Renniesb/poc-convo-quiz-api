# poc-convo-quiz-api

Migrations: https://www.npmjs.com/package/postgrator-cli

Settings in [`./postgrator.js`](./postgrator.js)

```js
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/quiz',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/quiz-test'
}
```

## Scripts

**migrate**

Using postgrator behind scenes to read `.sql` files in `./migrations` dir.

- `npm run migrate` to migrate to latest schema
- `npm run migrate -- 1` to migrate to step 1 of schema
- `npm run migrate -- 0` to completely rollback schema

**seed**

Use the files inside `./seeds` dir

e.g. to seed the database named `quiz`:
