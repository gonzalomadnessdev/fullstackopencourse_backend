const db = require('../database/mongodb')
const mongoose = require('mongoose')

module.exports = db.createModel('User', {
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  password: String,
  name: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
},
['password']
)