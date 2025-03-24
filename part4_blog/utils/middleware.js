const logger = require('./logger')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const config = require('./config')

morgan.token('request-body', req => JSON.stringify(req.body))

const requestLogger = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') morgan(':method :url :status :res[content-length] - :response-time ms :request-body')(req, res, next)
  else morgan('tiny')(req, res, next)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  } else if (error.name === 'ApiHttpException'){
    return response.status(error.statusCode).json({ error: `${error.message}` })
  }
  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  let token = null
  if (authorization && authorization.startsWith('Bearer ')) {
    token = authorization.replace('Bearer ', '')
  }
  req.token = token
  next()
}

const userExtractor = (req, res, next) => {
  if(req.token === null) return res.status(401).json({ error: 'Access denied. No token provided.' })

  const { username, id } = jwt.verify(req.token, config.JWT_SECRET)
  if (!id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  req.user = { username, id }
  next()

}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor,
  tokenExtractor
}