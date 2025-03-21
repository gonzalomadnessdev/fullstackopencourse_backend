const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const db = require('../database/mongodb')

db.connect()

beforeEach(async () => {
  await User.deleteMany({})
})

describe('users creation...', () => {
  test('passwordless users are not created, returns bad request and an error message', async () => {
    const newUserObj = {
      username : 'admin',
      name : 'Saul Hudson',
    }

    const createUserResponse = await api.post('/api/users')
      .send(newUserObj)
      .expect(400)

    assert(createUserResponse.body.error)

    const userStored = await User.findOne({ username : newUserObj.username })

    assert(!userStored)
  })

  test('users with short passwords are not created, returns bad request and an error message', async () => {
    const newUserObj = {
      username : 'admin',
      name : 'Saul Hudson',
      password : '1'
    }

    const createUserResponse = await api.post('/api/users')
      .send(newUserObj)
      .expect(400)

    assert(createUserResponse.body.error)

    const userStored = await User.findOne({ username : newUserObj.username })

    assert(!userStored)
  })

  test('users without username property are not created, returns bad request and an error message', async () => {
    const newUserObj = {
      name : 'Saul Hudson',
      password : '123456*'
    }

    const createUserResponse = await api.post('/api/users')
      .send(newUserObj)
      .expect(400)

    assert(createUserResponse.body.error)

    const userStored = await User.findOne({ username : newUserObj.username })

    assert(!userStored)
  })

  test('users with short username are not created, returns bad request and an error message', async () => {
    const newUserObj = {
      username : 'a',
      name : 'Saul Hudson',
      password : '123456*'
    }

    const createUserResponse = await api.post('/api/users')
      .send(newUserObj)
      .expect(400)

    assert(createUserResponse.body.error)

    const userStored = await User.findOne({ username : newUserObj.username })

    assert(!userStored)
  })
})



after(async () => {
  await mongoose.connection.close()
})