const questionService = {
updateQuestion(db,id, newQuestionFields){
  return db('questions')
  .where({id})
  .update(newQuestionFields)
},
getAll(db){
  return db
  .from('questions')
  .select('*')
},
getById(db, id) {
    return db.from('questions').select('*').where('id', id).first()
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

module.exports = questionService