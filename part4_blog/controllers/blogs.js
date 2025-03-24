const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate({ path: 'user', select: 'username name' })
  return response.json(blogs)
})

router.post('/', middleware.authenticationHandler, async (request, response) => {
  let { title, url, likes, author } = request.body

  if(!(title && url)) {
    return response.sendStatus(400)
  }

  likes ??= 0
  author ??= null

  const user = await User.findById(request.decodedToken.id)

  const blog = new Blog({ title, url, likes, author, user : user.id })
  const createdBlog = await blog.save()

  user.blogs = [ ...user.blogs , createdBlog.id ]
  await user.save()

  return response.status(201).json(createdBlog)
})

router.delete('/:id', middleware.authenticationHandler , async (request, response) => {
  const id = request.params.id

  await Blog.findByIdAndDelete(id)
  return response.status(204).end()
})

router.put('/:id', middleware.authenticationHandler, async (request, response) => {
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