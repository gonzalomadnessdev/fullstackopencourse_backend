const db = require('../database/mongodb')

module.exports = db.createModel('User', {
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  password: String,
  name: String
},
['password']
)