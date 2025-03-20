const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const db = require('../database/mongodb')
const blog = require('../models/blog')

const blogs = [
  { 'title': 'A New Level',
    'author': 'Dimebag Darrell',
    'url': 'https://es.wikipedia.org/wiki/Pantera_(banda)',
    'likes': 666
  }
]

db.connect()

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogs)
})

describe('when a collection of blogs is retrieved...', () => {
  test('blogs are a list of json with one element (test database)', async () => {
    const response = await api.get('/api/blogs')
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 1)
  })

  test('blogs use id as a key instead _id', async () => {
    const response = await api.get('/api/blogs')
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

    const createBlogResponse = await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)

    assert.partialDeepStrictEqual(createBlogResponse.body, newBlog)

    const getBlogsResponse = await api.get('/api/blogs')
      .expect(200)

    assert.strictEqual(getBlogsResponse.body.length - blogs.length, 1)
  })

  test('blog\'s likes are defaulted to zero when are missing from request', async () => {
    const newBlog = {
      title : 'Poison Was the Cure',
      author : 'Dave Mustaine',
      url : 'https://en.wikipedia.org/wiki/Rust_in_Peace',
    }

    const createBlogResponse = await api.post('/api/blogs')
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
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('url is required when a blog is created, if missing bad request is returned', async () => {
    const newBlog = {
      title : 'Hangar 18',
      author : 'Nick Menza',
      likes : 0
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('when a blog is deleted...', () => {
  test('with a correct id, the blog is succesfully deleted and 204 is returned', async () => {

    const blogs = await Blog.find({})
    const blogId = blogs[0].id

    await api.delete(`/api/blogs/${blogId}`).expect(204)

    const found = await blog.findById(blogId)
    assert(!found)

  })
})

describe('when a blog is updated...', () => {
  test('with a correct id and only with likes in the request body, blog is successfully updated and 200 is returned', async () => {

    const blog = (await Blog.find({}))[0]
    const blogId = blog.id

    const bodyRequest = { likes : 999 }

    const updatedBlog = await api.put(`/api/blogs/${blogId}`).send(bodyRequest).expect(200)

    const expectedBlog = { ...blog.toJSON() , ...bodyRequest }
    assert.deepStrictEqual(updatedBlog.body, expectedBlog)
  })
})


after(async () => {
  await mongoose.connection.close()
})