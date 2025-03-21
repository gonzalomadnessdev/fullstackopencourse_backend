const router = require('express').Router()
const ApiHttpException = require('../exceptions/ApiHttpException')
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/', async (request, response) => {
  const blogs = await User.find({}).populate({ path: 'blogs', select: 'title author url' })
  return response.json(blogs)
})

router.post('/', async (request, response) => {
  let { name, username, password } = request.body

  if(!password) {
    throw new ApiHttpException('password id required', 400)
  }
  if(password.length < 3) {
    throw new ApiHttpException('password must be a least 3 characters long', 400)
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    password : passwordHash,
    blogs : []
  })

  const createdUser = await user.save()
  return response.status(201).json(createdUser)
})

module.exports = router