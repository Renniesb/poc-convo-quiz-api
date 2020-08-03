const quizService = {
getAllQuizes(db){
  return db
  .from('quiz')
  .select('*')
  .orderBy('id')
},
insertQuiz(db, newQuiz){
  return db
    .insert(newQuiz)
    .into('quiz')
    .returning('*')
    .then(rows => {
       return rows[0]
    })
},
getQuizById(db, id){
  return db.from('quiz').select('*').where({id}).first()
},
deleteQuiz(db, id){
  return db('quiz')
    .where({id})
    .delete()
},
updateQuiz(db,id, newQuizInfo){
  return db('quiz')
  .where({id})
  .update(newQuizInfo)
},
updateQuestion(db,id, newQuestionFields){
  return db('questions')
  .where({id})
  .update(newQuestionFields)
},
getAllQuestions(db){
  return db
  .from('questions')
  .select('*')
},
getQuizQuestions(db, quizNum){
  return db
  .from('questions')
  .where('questions.quiznum', quizNum)
  .select('*').orderBy('id')
},
getQuestionById(db, id) {
    return db.from('questions').select('*').where({id}).first()
},
insertQuestion(db, newQuestion){

  return db
    .insert(newQuestion)
    .into('questions')
    .returning('*')
    .then(rows => {
       return rows[0]
    })
},
deleteQuestion(db, id){
  return db('questions')
    .where({id})
    .delete()
}
}

module.exports = quizService