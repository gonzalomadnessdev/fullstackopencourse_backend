const express = require('express')
const cors = require('cors')
require('express-async-errors')
const db = require('./database/mongodb')
const middleware = require('./utils/middleware')
const healthcheckRouter = require('./controllers/healthcheck')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const app = express()

db.connect()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
if(process.env.NODE_ENV !== 'test'){
  app.use(middleware.requestLogger)
}

app.use(middleware.tokenExtractor)

//routes
app.use('/api/health', healthcheckRouter)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
//endroutes

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app