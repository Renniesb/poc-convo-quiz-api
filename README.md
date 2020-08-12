# poc-convo-quiz-api

link to live api: https://still-garden-93095.herokuapp.com/

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

```bash
psql -U $DB_USER -d $DB_NAME -f ./seeds/seed.quiz_questions.sql
psql -U postgres -d quiz -f ./seeds/seed.quiz_questions.sql
psql -U postgres -d quiz -f ./seeds/seed.quizzes.sql
```


## Endpoints

### Quizzes

- `GET /api/quiz`
  - get all quizzes
- `POST /api/quiz`
  - create a quiz

- `GET /api/quiz/:quizId`
  - get a specific quiz
- `PATCH /api/quiz/:quizId`
  - update a specific quiz
- `DELETE /api/quiz/:quizId`
  - delete a specific quiz

### Questions


- `GET /api/questions`
  - get all questions
- `POST /api/questions`
  - create a question
  
- `GET /api/quiz/:quizNum/questions`
  - get all questions from a specific quiz

- `GET /api/questions/:id`
  - get a specific question
- `PATCH /api/questions/:id`
  - update a specific question
- `DELETE /api/questions/:id`
  - delete a specific question



## Welcome

- `GET /`
  - Express Welcome to Express

## Environmental Variables

**for running the app:**

`DATABASE_URL` is being used by `./src/server.js` to initialize knex.
The expected format is:

```bash
"postgresql://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME"
```


You should only need `DATABASE_URL` to start the application.

There are default values set in `./src/config.js` but they probably won't work for you. You should set your own values for it in your `.env`.



