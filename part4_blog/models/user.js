const db = require('../database/mongodb')

module.exports = db.createModel('User', {
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  name: String
},
['password']
)