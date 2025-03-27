const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate({ path: 'user', select: 'username name' })
  return response.json(blogs)
})

router.post('/', async (request, response) => {
  let { title, url, likes, author } = request.body

  if(!(title && url)) {
    return response.sendStatus(400)
  }

  likes ??= 0
  author ??= null

  const user = await User.findById(request.user.id)
  if(user === null) return response.status(400).json({ error : 'user not found' })

  const blog = new Blog({ title, url, likes, author, user : user.id })
  const createdBlog = await blog.save()

  user.blogs = [ ...user.blogs , createdBlog.id ]
  await user.save()

  const populatedBlog = await Blog.findById(createdBlog.id).populate({ path: 'user', select: 'username name' })

  return response.status(201).json(populatedBlog)
})

router.delete('/:id' , async (request, response) => {
  const id = request.params.id

  const blog = await Blog.findById(id)
  if(blog === null) return response.status(400).json({ error : 'blog not found' })

  const userId = blog.user.toString()
  if(userId !== request.user.id) return response.status(403).json({ error : 'cannot perform deleting in other owner\'s blogs' })

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

  await blog.save()
  const updatedBlog = await Blog.findById(id).populate({ path: 'user', select: 'username name' })

  return response.json(updatedBlog)
})

module.exports = router