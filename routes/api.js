var express = require('express');
var router = express.Router();
var questionService = require('../services/question-service');
const { route } = require('.');
const jsonBodyParser = express.json()

const serializeQuestion = question => ({
  id: question.id,
  answers: question.answers,
  questiontext: question.questiontext,
  responsetext: question.responsetext,
  correcttext: question.correcttext,
  audio: question.audio
})

router.get('/questions', (req,res,next)=>{
  questionService.getAll(req.app.get('db'))
  .then(articles => {
    res.json(articles)
  })
  .catch(next)
})

router.get('/questions/:id', function(req, res, next) {
  questionService.getById(
    req.app.get('db'),
    req.params.id
  )
  .then(data=>{
    if (!data) {
        return res.status(404).json({
          error: { message: `question doesn't exist` }
        })
    }
    
    res.json(data);
  
    
  })
  .catch(next)
});

router.post('/questions', jsonBodyParser, function(req,res,next){
  const {answers, questiontext, responsetext, correcttext, audio} = req.body
  const newQuestion = {answers, questiontext, responsetext, correcttext, audio}


  for (const [key, value] of Object.entries(jsonBodyParser))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
  })


  questionService.insertQuestion(req.app.get('db'), newQuestion)
  .then(question => {
    res
      .status(201)
      .json(serializeQuestion(question))
  })
  .catch(next)
})

router.delete('/questions/:id',(req, res, next) => {
  questionService.deleteQuestion(
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
    audio
  } = req.body
  const questionToUpdate = {
    answers,
    questiontext,
    responsetext,
    correcttext, 
    audio
  }


  const numberOfValues = Object.values(questionToUpdate).filter(Boolean).length
  if(numberOfValues === 0)
    return res.status(400).json({
      error: {
        message: `Request body must contain all relevant field values`
      }
    })
  
  questionService.updateQuestion(
    req.app.get('db'),
    req.params.id,
    questionToUpdate
  )
  .then(()=>{
    res.status(204).end()
  })
  .catch(next)
})

module.exports = router;
