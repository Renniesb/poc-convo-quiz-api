const questionService = {
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