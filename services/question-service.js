const questionService = {
getById(knex, id) {
    return knex.from('questions').select('*').where('id', id)
  },
insertQuestion(db, newQuestion){
  return db
    .insert(newQuestion)
    .into('questions')
}
}

module.exports = questionService