const questionService = {
getById(knex, id) {
    return knex.from('questions').select('*').where('id', id)
  },
}

module.exports = questionService