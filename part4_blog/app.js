const express = require('express')
const cors = require('cors')
const db = require('./database/mongodb')
const middleware = require('./utils/middleware')
const healthcheckRouter = require('./controllers/healthcheck')
const blogsRouter = require('./controllers/blogs')
const app = express()

db.connect()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

//routes
app.use('/api/health', healthcheckRouter)
app.use('/api/blogs', blogsRouter)
//endroutes

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app