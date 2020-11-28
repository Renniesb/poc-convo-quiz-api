var express = require('express')
var router = express.Router()
var quizService = require('../services/quiz-service')
const { route } = require('.')
const jsonBodyParser = express.json()

//place response from the server into a serialized format

const serializeQuestion = question => ({
  id: question.id,
  answers: question.answers,
  questiontext: question.questiontext,
  responsetext: question.responsetext,
  correcttext: question.correcttext,
  link: question.link,
  linktype: question.linktype,
  quiznum: question.quiznum
})

//place response from the server into a serialized format

const serializeQuiz = quiz => ({
  id: quiz.id,
  quizname:quiz.quizname,
  quizdescription:quiz.quizdescription,
  level: quiz.level,
  locked: quiz.locked
})
//get all quizzes and post a new quiz
router.route('/quiz')
.get((req, res, next)=>{
  quizService.getAllQuizes(req.app.get('db'))
  .then(quiz => {
    res.json(quiz)
  })
  .catch(next)
})
.post(jsonBodyParser,(req, res, next)=>{

  const {quizname, quizdescription, level, locked} = req.body
  const newQuiz ={quizname, quizdescription, level, locked} 
  quizService.insertQuiz(req.app.get('db'), newQuiz)
  .then(quiz => {
    res
      .status(201)
      .json(serializeQuiz(quiz))
  })
  .catch(next)
})

// routes get, update and delete a specific quiz
router.route('/quiz/:quizID')
.get((req, res, next)=>{
  quizService.getQuizById(
    req.app.get('db'), 
    req.params.quizID)
    .then((data)=>{
      if (!data) {
        return res.status(404).json({
          error: { message: `quiz doesn't exist` }
      })
    }
    res.json(data)
    })
    .catch(next)
})
.delete((req, res, next)=>{
  quizService.deleteQuiz(
    req.app.get('db'), 
    req.params.quizID)
  .then((data) => {
    if (!data) {
      return res.status(404).json({
        error: { message: `quiz doesn't exist` }
      })
    }
    res.status(204).json().end()
  })
  .catch(next)
})
.patch((req, res, next)=>{
  const {quizname, quizdescription, level, locked} = req.body
  const updatedQuiz = {quizname, quizdescription, level, locked}
  
  const numberOfValues = Object.values(updatedQuiz).filter(Boolean).length
  if(numberOfValues === 0)
    return res.status(400).json({
      error: {
        message: `Request body must contain all relevant field values`
      }
    })

  quizService.updateQuiz(req.app.get('db'), req.params.quizID, updatedQuiz)
  .then(()=>{
    res.status(204).end()
  })
  .catch(next)
  
  
})
//get all questions from a specific quiz
router.get('/quiz/:quizNum/questions', (req,res,next)=>{
  quizService.getQuizQuestions(req.app.get('db'),req.params.quizNum)
  .then(questions => {
    res.json(questions)
  })
  .catch(next)
})

//get all questions and post a new question
router.get('/questions', (req, res, next)=>{
  quizService.getAllQuestions(req.app.get('db'))
  .then(quiz => {
    res.json(quiz)
  })
  .catch(next)
})
router.post('/questions', jsonBodyParser, function(req,res,next){
  const {questiontype, answers, questiontext, responsetext, correcttext, link, linktype, quiznum} = req.body
  const newQuestion = {questiontype, answers, questiontext, responsetext, correcttext, link,linktype, quiznum}


  for (const [key, value] of Object.entries(jsonBodyParser))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
  })


  quizService.insertQuestion(req.app.get('db'), newQuestion)
  .then(question => {
    res
      .status(201)
      .json(serializeQuestion(question))
  })
  .catch(next)
})
//get, update and delete a specific question
router.get('/questions/:id', function(req, res, next) {
  quizService.getQuestionById(
    req.app.get('db'),
    req.params.id
  )
  .then(data=>{
    if (!data) {
        return res.status(404).json({
          error: { message: `question doesn't exist` }
        })
    }
    
    res.json(data)
  
    
  })
  .catch(next)
})
router.delete('/questions/:id',(req, res, next) => {
  quizService.deleteQuestion(
    req.app.get('db'),
    req.params.id
  )
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          error: { message: `Question doesn't exist` }
        })
      }
      res.status(204).json().end()
    })
    .catch(next)
})
router.patch('/questions/:id',jsonBodyParser, (req, res, next)=>{
  const { 
    answers,
    questiontext,
    responsetext,
    correcttext,
    link,
    linktype
  } = req.body
  const questionToUpdate = {
    answers,
    questiontext,
    responsetext,
    correcttext, 
    link,
    linktype
  }

  //make sure that the question contains all the required values
  const numberOfValues = Object.values(questionToUpdate).filter(Boolean).length
  if(numberOfValues === 0)
    return res.status(400).json({
      error: {
        message: `Request body must contain all relevant field values`
      }
    })
  
  quizService.updateQuestion(
    req.app.get('db'),
    req.params.id,
    questionToUpdate
  )
  .then(()=>{
    res.status(204).end()
  })
  .catch(next)
})

module.exports = router
