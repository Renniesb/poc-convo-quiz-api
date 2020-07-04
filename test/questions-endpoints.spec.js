
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
    
    describe(`GET /api/questions`, () => {
      context(`Given no questions`, () => {
        it(`responds with 200 and an empty list`, () => {
          return supertest(app)
            .get('/api/questions')
            .expect(200, [])
        })
      })
  
      context('Given there are questions in the database', () => {
        const testQuestions = makeQuestionsArray()
  
        beforeEach('insert questions', () => {
          return db
            .into('questions')
            .insert(testQuestions)
        })
  
        it('responds with 200 and all of the questions', () => {
          return supertest(app)
            .get('/api/questions')
            .expect(200, testQuestions)
        })
      })
    })  
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
      it(`creates a question, responding with 201 and the new question`, () => {
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
  
        it('responds with 204 and removes the question', () => {
          const idToRemove = 2
          const expectedQuestions = testQuestions.filter(question => question.id !== idToRemove)
          return supertest(app)
            .delete(`/api/questions/${idToRemove}`)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/questions`)
                .expect(expectedQuestions)
            )
        })
      })
    })
    describe(`PATCH /api/questions/:id`, () => {
      context(`Given no questions`, () => {
        it(`responds with 404`, () => {
          const questionId = 123456
          return supertest(app)
            .delete(`/api/questions/${questionId}`)
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
  
        it('responds with 204 and updates the question', () => {
          const idToUpdate = 2
          const updateQuestion = {
            answers: 'updated answer',
            questiontext: 'updated question text' ,
            responsetext: 'updated response',
            correcttext: 'updated correct text', 
            audio:'updated audio',
          }
          const expectedQuestion = {
            ...testQuestions[idToUpdate - 1],
            ...updateQuestion
          }
          return supertest(app)
            .patch(`/api/questions/${idToUpdate}`)
            .send(updateQuestion)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/questions/${idToUpdate}`)
                .expect(expectedQuestion)
            )
        })
  
        it(`responds with 400 when no required fields supplied`, () => {
          const idToUpdate = 2
          return supertest(app)
            .patch(`/api/questions/${idToUpdate}`)
            .send({ irrelevantField: 'foo' })
            .expect(400, {
              error: {
                message: `Request body must contain all relevant field values`
              }
            })
        })
  
        it(`responds with 204 when updating only a subset of fields`, () => {
          const idToUpdate = 2
          const updateQuestion = {
            answers: 'updated answer',
          }
          const expectedQuestion = {
            ...testQuestions[idToUpdate - 1],
            ...updateQuestion
          }
  
          return supertest(app)
            .patch(`/api/questions/${idToUpdate}`)
            .send({
              ...updateQuestion,
              fieldToIgnore: 'should not be in GET response'
            })
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/questions/${idToUpdate}`)
                .expect(expectedQuestion)
            )
        })
      })
    })
})

module.exports = {
    makeQuestionsArray
}