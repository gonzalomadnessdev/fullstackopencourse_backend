const { test, after, beforeEach, before , describe } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const db = require('../database/mongodb')

let userObj = {
  user : 'John Doe',
  username : 'jdoe',
  password : '123456*',
  blogs : []
}

let blogsObj = [
  {
    'title': 'A New Level',
    'author': 'Dimebag Darrell',
    'url': 'https://es.wikipedia.org/wiki/Pantera_(banda)',
    'likes': 666,
    'user': null
  }
]

let userId
let savedBlogs
let token

db.connect()

before(async () => {
  await User.deleteMany({})
  const userCreatedResponse = await api.post('/api/users').send(userObj)
  userId = userCreatedResponse.body.id

  //login
  const loginResponse = await api.post('/api/login').send({ username : userObj.username, password : userObj.password })
  token = `Bearer ${loginResponse.body.token}`
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogs = blogsObj.map( b => { return { ...b, user: userId }})

  savedBlogs = await Blog.insertMany(blogs)
  const userModel = await User.findById(userId)

  userModel.blogs = savedBlogs.map( b => b.id )
  await userModel.save()
})

describe('when a collection of blogs is retrieved...', () => {
  test('blogs are a list of json with one element (test database)', async () => {
    const response = await api.get('/api/blogs').set('Authorization', token)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 1)
  })

  test('blogs use id as a key instead _id', async () => {
    const response = await api.get('/api/blogs').set('Authorization', token)
      .expect(200)

    assert(Object.keys(response.body[0]).includes('id'))
  })
})

describe('when a blog is creted...', () => {
  test('blogs are successfully created', async () => {
    const newBlog = {
      title : 'Appetite for Destruction',
      author : 'Saul Hudson',
      url : 'https://es.wikipedia.org/wiki/Guns_N%27_Roses',
      likes : 1
    }

    const createBlogResponse = await api.post('/api/blogs').set('Authorization', token)
      .send(newBlog)
      .expect(201)

    assert.partialDeepStrictEqual(createBlogResponse.body, newBlog)

    const getBlogsResponse = await api.get('/api/blogs').set('Authorization', token)
      .expect(200)

    assert.strictEqual(getBlogsResponse.body.length - savedBlogs.length, 1)
  })

  test('blog\'s likes are defaulted to zero when are missing from request', async () => {
    const newBlog = {
      title : 'Poison Was the Cure',
      author : 'Dave Mustaine',
      url : 'https://en.wikipedia.org/wiki/Rust_in_Peace',
    }

    const createBlogResponse = await api.post('/api/blogs').set('Authorization', token)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(createBlogResponse.body.likes, 0)
  })

  test('title is required, if missing bad request is returned', async () => {
    const newBlog = {
      author : 'David Ellefson',
      url : 'https://en.wikipedia.org/wiki/Rust_in_Peace',
      likes : 0
    }
    await api.post('/api/blogs').set('Authorization', token)
      .send(newBlog)
      .expect(400)
  })

  test('url is required when a blog is created, if missing bad request is returned', async () => {
    const newBlog = {
      title : 'Hangar 18',
      author : 'Nick Menza',
      likes : 0
    }

    await api.post('/api/blogs').set('Authorization', token)
      .send(newBlog)
      .expect(400)
  })
})

describe('when a blog is deleted...', () => {
  test('with a correct id, the blog is succesfully deleted and 204 is returned', async () => {

    const blog = await Blog.findOne({ user : userId })
    const blogId = blog.id

    await api.delete(`/api/blogs/${blogId}`).set('Authorization', token).expect(204)

    const found = await Blog.findById(blogId)
    assert(!found)

  })
})

describe('when a blog is updated...', () => {
  test('with a correct id and only with likes in the request body, blog is successfully updated and 200 is returned', async () => {

    const blog = await Blog.findOne({ user : userId })
    const blogId = blog.id

    const bodyRequest = { likes : 999 }

    const updatedBlog = await api.put(`/api/blogs/${blogId}`).set('Authorization', token).send(bodyRequest).expect(200)

    const expectedBlog = { ...blog.toJSON() , ...bodyRequest }
    expectedBlog.user = expectedBlog.user.toString()

    assert.deepStrictEqual(updatedBlog.body, expectedBlog)
  })
})


after(async () => {
  await mongoose.connection.close()
})