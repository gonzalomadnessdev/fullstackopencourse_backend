const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

router.post('/', async (request, response) => {
  let _blog = { ...request.body }
  _blog.likes ??= 0

  const blog = new Blog(_blog)

  const createdBlog = await blog.save()
  response.status(201).json(createdBlog)
})

module.exports = router