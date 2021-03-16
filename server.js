const pg = require('pg');
pg.defaults.ssl = process.env.NODE_ENV === "production";
const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')

//establish db connection and listen on the port specified in config
const db = knex({
    client: 'pg',
    connection: DATABASE_URL,
})

app.set('db', db)


app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})