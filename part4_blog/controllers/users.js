const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/', async (request, response) => {
  const blogs = await User.find({})
  return response.json(blogs)
})

router.post('/', async (request, response) => {
  let { name, username, password } = { ...request.body }

  if(!(name && username && password)) {
    return response.sendStatus(400)
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const createdUser = await user.save()
  return response.status(201).json(createdUser)
})

module.exports = router