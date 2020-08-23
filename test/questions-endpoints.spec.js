
const knex = require('knex')
const app = require('../app')
const makeQuestionsArray  = require('./questions.fixtures')
const makeQuizArray  = require('./quiz.fixtures')
const { expect } = require('chai')

describe('Questions Endpoints', function() {
    let db
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('clean the tables', () => db.raw('TRUNCATE TABLE quiz, questions CASCADE'))
    
    afterEach('clean the tables', () => db.raw('TRUNCATE TABLE quiz, questions CASCADE'))
    
    describe(`GET /api/questions/`, () => {
      context(`Given no questions`, () => {
        const testQuizzes = makeQuizArray()
        beforeEach('insert quizzes', () => {
          return db
            .into('quiz')
            .insert(testQuizzes)
        })
        it(`responds with 200 and an empty list`, () => {
          const quizID = 1
          return supertest(app)
            .get(`/api/quiz/${quizID}/questions`)
            .expect(200, [])
        })
      })
  
      context('Given there are questions in the database', () => {
        const testQuizzes = makeQuizArray()
        const testQuestions = makeQuestionsArray()
        
        beforeEach('insert quizzes', () => {
          return db
            .into('quiz')
            .insert(testQuizzes)
        })
  
        beforeEach('insert questions', () => {
          return db
            .into('questions')
            .insert(testQuestions)
        })
  
        it('responds with 200 and all of the questions', () => {
          const quizID = 1
          let testQuizQuestions = testQuestions.filter(question => question.quiznum == quizID)
          return supertest(app)
            .get(`/api/quiz/${quizID}/questions`)
            .expect(200, testQuizQuestions)
        })
      })
    })  
    describe(`GET /api/questions/:id`, () => {
      context(`Given the question doesnt exist`, () => {
        it(`responds with 404`, () => {
          const questionId = 123456
          return supertest(app)
            .get(`/api/questions/${questionId}`)
            .expect(404, { error: { message: `question doesn't exist` } })
        })
      })
  
      context('Given the question is in the database', () => {
        const testQuizzes = makeQuizArray()
        const testQuestions = makeQuestionsArray()
        
        beforeEach('insert quizzes', () => {
          return db
            .into('quiz')
            .insert(testQuizzes)
        })
  
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
      const testQuizzes = makeQuizArray()
        
      beforeEach('insert quizzes', () => {
        return db
          .into('quiz')
          .insert(testQuizzes)
      })
      it(`creates a question, responding with 201 and the new question`, () => {
        const newQuestion = {
          answers: 'new answer',
          questiontext: 'new question',
          responsetext: 'New response text.',
          correcttext: 'new correct text',
          link: 'audio1',
          linktype: 'audio',
          quiznum: 1,
          
        }
        return supertest(app)
          .post(`/api/questions`)
          .send(newQuestion)
          .expect(201)
          .expect(res => {
            expect(res.body.answers).to.eql(newQuestion.answers)
            expect(res.body.questiontext).to.eql(newQuestion.questiontext)
            expect(res.body.responsetext).to.eql(newQuestion.responsetext)
            expect(res.body.correcttext).to.eql(newQuestion.correcttext)
            expect(res.body.link).to.eql(newQuestion.link)
            expect(res.body.linktype).to.eql(newQuestion.linktype)
            expect(res.body).to.have.property('id')
          })
          .then(res => {
            supertest(app)
              .get(`/api/questions/${res.body.id}`)
              .expect(res.body)
          }
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
        const testQuizzes = makeQuizArray()
        
        beforeEach('insert quizzes', () => {
          return db
            .into('quiz')
            .insert(testQuizzes)
        })        
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
        const testQuizzes = makeQuizArray()
        beforeEach('insert quizzes', () => {
          return db
            .into('quiz')
            .insert(testQuizzes)
        })
  
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
            link:'updated audio',
            linktype:'audio'
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
    describe(`GET /api/quiz`, () => {
      
      context(`Given no quizzes`, () => {
        it(`responds with 200 and an empty list`, () => {
          return supertest(app)
            .get('/api/quiz')
            .expect(200, [])
        })
      })
  
      context('Given there are quizzes in the database', () => {

        const testQuizzes = makeQuizArray()
        
        beforeEach('insert quizzes', () => {
          return db
            .into('quiz')
            .insert(testQuizzes)
        }) 
  
        it('responds with 200 and all of the quizzes', () => {
          return supertest(app)
            .get('/api/quiz')
            .expect(200, testQuizzes)
        })
      })
    })
    describe(`POST /api/quiz`, () => {
      
      it(`creates a quiz, responding with 201 and the new quiz`, () => {
        const newQuiz = {
          quizname:'Despicable me',
          quizdescription:'A video quiz to test your comprehension',
          level: 'Beginner',
          locked: false
        }
        return supertest(app)
          .post(`/api/quiz`)
          .send(newQuiz)
          .expect(201)
          .expect(res => {
            expect(res.body.quizname).to.eql(newQuiz.quizname)
            expect(res.body.quizdescription).to.eql(newQuiz.quizdescription)
            expect(res.body.level).to.eql(newQuiz.level)
            expect(res.body.locked).to.eql(newQuiz.locked)
          })
          .then(res =>
            supertest(app)
              .get(`/api/quiz/${res.body.id}`)
              .expect(res.body)
          )
      })
    })
    describe(`GET /api/quiz/:id`, () => {
      context(`Given no quiz`, () => {
        it(`responds with 404`, () => {
          const quizId = 123456
          return supertest(app)
            .get(`/api/quiz/${quizId}`)
            .expect(404, { error: { message: `quiz doesn't exist` } })
        })
      })
  
      context('Given there are quizzes in the database', () => {
        const testQuizzes = makeQuizArray()
        
        beforeEach('insert quizzes', () => {
          return db
            .into('quiz')
            .insert(testQuizzes)
        }) 
  
        it('responds with 200 and the specified question', () => {
          const quizId = 2
          const expectedQuiz = testQuizzes[quizId - 1]
          return supertest(app)
            .get(`/api/quiz/${quizId}`)
            .expect(200, expectedQuiz)
        })
      })
      
    })  
    describe(`DELETE /api/quiz/:id`, () => {
      context(`Given no quiz`, () => {
        it(`responds with 404`, () => {
          const id = 123456
          return supertest(app)
            .delete(`/api/quiz/${id}`)
            .expect(404, { error: { message: `quiz doesn't exist` } })
        })
      })
  
      context('Given there are quizzes in the database', () => {
        const testQuizzes = makeQuizArray()
        
        beforeEach('insert quizzes', () => {
          return db
            .into('quiz')
            .insert(testQuizzes)
        })        
  
        it('responds with 204 and removes the quiz', () => {
          const idToRemove = 2
          const expectedQuizzes = testQuizzes.filter(quiz => quiz.id !== idToRemove)
          return supertest(app)
            .delete(`/api/quiz/${idToRemove}`)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/quiz`)
                .expect(expectedQuizzes)
            )
        })
      })
    })
    describe(`PATCH /api/quiz/:id`, () => {
      context(`Given no quizzes`, () => {
        it(`responds with 404`, () => {
          const quizID = 123456
          return supertest(app)
            .delete(`/api/quiz/${quizID}`)
            .expect(404, { error: { message: `quiz doesn't exist` } })
        })
      })
  
      context('Given there are quizzes in the database', () => {
        
        const testQuizzes = makeQuizArray()
        beforeEach('insert quizzes', () => {
          return db
            .into('quiz')
            .insert(testQuizzes)
        })
  
        it('responds with 204 and updates the quiz', () => {
          const idToUpdate = 2
          const updateQuiz = {
            quizname: 'new quiz',
            quizdescription: 'newdescription',
            level: 'level',
            locked: true
          }
          const expectedQuiz = {
            ...testQuizzes[idToUpdate - 1],
            ...updateQuiz
          }
          return supertest(app)
            .patch(`/api/quiz/${idToUpdate}`)
            .send(updateQuiz)
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/quiz/${idToUpdate}`)
                .expect(expectedQuiz)
            )
        })
  
        it(`responds with 400 when no required fields supplied`, () => {
          const idToUpdate = 2
          return supertest(app)
            .patch(`/api/quiz/${idToUpdate}`)
            .send({ irrelevantField: 'foo' })
            .expect(400, {
              error: {
                message: `Request body must contain all relevant field values`
              }
            })
        })
  
        it(`responds with 204 when updating only a subset of fields`, () => {
          const idToUpdate = 2
          const updateQuiz = {
            quizname: 'updated name',
          }
          const expectedQuiz = {
            ...testQuizzes[idToUpdate - 1],
            ...updateQuiz
          }
  
          return supertest(app)
            .patch(`/api/quiz/${idToUpdate}`)
            .send({
              ...updateQuiz,
              fieldToIgnore: 'should not be in GET response'
            })
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/quiz/${idToUpdate}`)
                .expect(expectedQuiz)
            )
        })
      })
    })
})

module.exports = {
    makeQuizArray,
    makeQuestionsArray
}