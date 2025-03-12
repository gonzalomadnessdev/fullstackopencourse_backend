const logger = require('./logger')
const morgan = require('morgan')

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
  }
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}