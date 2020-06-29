var express = require('express');
var router = express.Router();
var questionService = require('../services/question-service')

/* GET users listing. */
router.get('/:id', function(req, res, next) {
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
    
    res.render('question', { id: data[0].id, title:JSON.stringify(data) });
    
  })
});

module.exports = router;
