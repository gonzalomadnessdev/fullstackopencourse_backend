const db = require('../database/mongodb')

module.exports = db.createModel('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})