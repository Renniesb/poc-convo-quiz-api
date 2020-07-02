var express = require('express');
var router = express.Router();
var questionService = require('../services/question-service')
const jsonBodyParser = express.json()

const serializeQuestion = question => ({
  id: question.id,
  answers: question.answers,
  questiontext: question.questiontext,
  responsetext: question.responsetext,
  correcttext: question.correcttext,
  audio: question.audio
})


/* GET users listing. */
router.get('/questions/:id', function(req, res, next) {
  questionService.getById(
    req.app.get('db'),
    req.params.id
  )
  .then(data=>{
    console.log(data);
    if (data.length==0) {
        return res.status(404).json({
          error: { message: `question doesn't exist` }
        })
    }
    
    res.json(data);
  
    
  })
});

router.route('/questions').post(jsonBodyParser, function(req,res,next){
  const {answers, questiontext, responsetext, correcttext, audio} = req.body
  const newQuestion = {answers, questiontext, responsetext, correcttext, audio}

  console.log(answers)
  console.log(questiontext)

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

module.exports = router;
