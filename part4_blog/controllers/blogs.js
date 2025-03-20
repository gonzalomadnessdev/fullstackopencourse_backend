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

router.delete('/:id', async (request, response) => {
  const id = request.params.id

  await Blog.findByIdAndDelete(id)
  return response.status(204).end()
})

router.put('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)

  if(!blog) return response.sendStatus(404)

  for(let key in request.body){
    if(['title', 'author', 'url', 'likes'].includes(key)){
      blog[key] = request.body[key]
    }
  }

  const updatedBlog = await blog.save()

  return response.json(updatedBlog)
})

module.exports = router