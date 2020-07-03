
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
            .expect(404, { error: { message: `question doesn't exist` } })
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
            .expect(200, expectedQuestion)
        })
      })
      
    })
    describe(`POST /api/questions`, () => {
      it(`creates an article, responding with 201 and the new article`, () => {
        const newQuestion = {
          answers: 'new answer',
          questiontext: 'new question',
          responsetext: 'New response text.',
          correcttext: 'new correct text',
          audio: 'audio1'
        }
        return supertest(app)
          .post('/api/questions')
          .send(newQuestion)
          .expect(201)
          .expect(res => {
            expect(res.body.answers).to.eql(newQuestion.answers)
            expect(res.body.questiontext).to.eql(newQuestion.questiontext)
            expect(res.body.responsetext).to.eql(newQuestion.responsetext)
            expect(res.body.correcttext).to.eql(newQuestion.correcttext)
            expect(res.body.audio).to.eql(newQuestion.audio)
            expect(res.body).to.have.property('id')
          })
          .then(res =>
            supertest(app)
              .get(`/api/questions/${res.body.id}`)
              .expect(res.body)
          )
      })
    })
    describe(`DELETE /api/questions/:id`, () => {
      context(`Given no questions`, () => {
        it(`responds with 404`, () => {
          const id = 123456
          return supertest(app)
            .delete(`/api/questions/${id}`)
            .expect(404, { error: { message: `Question doesn't exist` } })
        })
      })
  
      context('Given there are questions in the database', () => {
        const testQuestions = makeQuestionsArray()
  
        beforeEach('insert questions', () => {
          return db
            .into('questions')
            .insert(testQuestions)
        })
  
        it('responds with 204 and removes the article', () => {
          const idToRemove = 2
          const expectedQuestions = testQuestions.filter(question => question.id !== idToRemove)
          return supertest(app)
            .delete(`/api/questions/${idToRemove}`)
            .expect(204)
            // .then(res =>
            //   supertest(app)
            //     .get(`/api/questions`)
            //     .expect(expectedQuestions)
            // )
        })
      })
    })
})

module.exports = {
    makeQuestionsArray
}