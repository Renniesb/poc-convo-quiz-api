var express = require('express');
var router = express.Router();
var questionService = require('../services/question-service')

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

module.exports = router;
