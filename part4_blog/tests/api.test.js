const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
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

after(async () => {
  await mongoose.connection.close()
})