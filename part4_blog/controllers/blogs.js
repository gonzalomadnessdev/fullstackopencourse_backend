const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

router.post('/', async (request, response) => {
  let _blog = { ...request.body }

  if(!_blog.title || !_blog.url) {
    return response.sendStatus(400)
  }

  _blog.likes ??= 0
  _blog.author ??= null //author defaulted to null

  const blog = new Blog(_blog)

  const createdBlog = await blog.save()
  return response.status(201).json(createdBlog)
})

module.exports = router