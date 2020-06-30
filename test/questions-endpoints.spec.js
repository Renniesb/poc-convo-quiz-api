
const knex = require('knex')
const app = require('../app')
const makeQuestionsArray  = require('./questions.fixtures')

describe('Questions Endpoints', function() {
    let db
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('clean the table', () => db('questions').truncate())
  
    afterEach('cleanup',() => db('questions').truncate())
  
  
    describe(`GET /api/questions/:id`, () => {
      context(`Given no questions`, () => {
        it(`responds with 404`, () => {
          const questionId = 123456
          return supertest(app)
            .get(`/api/questions/${questionId}`)
            .expect(404)
        })
      })
  
      context('Given there are questions in the database', () => {
        const testQuestions = makeQuestionsArray()
  
        beforeEach('insert questions', () => {
          return db
            .into('questions')
            .insert(testQuestions)
        })
  
        it('responds with 200 and the specified question', () => {
          const questionId = 2
          const expectedQuestion = testQuestions[questionId - 1]
          return supertest(app)
            .get(`/api/questions/${questionId}`)
            .expect(200, [expectedQuestion])
        })
      })
    })
})

module.exports = {
    makeQuestionsArray
}