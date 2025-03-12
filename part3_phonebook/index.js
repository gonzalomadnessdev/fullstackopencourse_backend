require('dotenv').config()
const express = require('express')
var morgan = require('morgan')

const Person = require('./models/person')

const app = express()
app.use(express.json())

morgan.token('request-body', req => JSON.stringify(req.body))

const requestLogger = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') morgan(':method :url :status :res[content-length] - :response-time ms :request-body')(req, res, next)
  else morgan('tiny')(req, res, next)
}
app.use(requestLogger)

const generateRandomId = () => {
  return Math.floor(Math.random() * 1000000000000).toString()
}

app.use(express.static('dist'))

app.get('/api/info', (request, response) => {
  const date = new Date()
  Person.find({}).then(persons => response.send(`Phonebook has info for ${persons.length} people </br> ${date}`))
})

app.get('/api/people', (request, response) => {
  Person.find({}).then(persons => response.json(persons))
})

app.post('/api/people', (request, response, next) => {
  const body = request.body
  if (!body.number) {
    return response.status(400).json({ error: 'number missing' })
  }
  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }

  Person.findOne({ name: body.name })
    .then(person => {
      console.log('findone', person)
      if (person) {
        return response.status(400).json({ error: 'name must be unique' })
      }

      const newPerson = new Person({
        id: generateRandomId(),
        name: body.name,
        number: body.number
      })

      newPerson.save()
        .then(savedPerson => response.json(savedPerson))
        .catch((error) => next(error))
    })

})

app.get('/api/people/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/people/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/people/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body

  const person = { name: body.name, number: body.number }

  Person.findByIdAndUpdate(
    id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})