const db = require('../database/mongodb')
const mongoose = require('mongoose')

module.exports = db.createModel('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})