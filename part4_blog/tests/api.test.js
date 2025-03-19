const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const db = require('../database/mongodb')

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

test('blogs are successfully created with post method', async () => {
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

test('blog\'s likes are defaulted to zero when are missing from request when created', async () => {
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

after(async () => {
  await mongoose.connection.close()
})