const express = require('express')
var morgan = require('morgan')
const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json())

morgan.token('request-body', req => JSON.stringify(req.body))
app.use((req, res, next) => {
    if(req.method === 'POST') morgan(':method :url :status :res[content-length] - :response-time ms :request-body')(req, res, next)
    else morgan('tiny')(req, res, next)
})

const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000000000).toString()
}

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.static('dist'))

app.get('/api/info', (request, response) => {
    const date = new Date();
    response.send(`Phonebook has info for ${persons.length} people </br> ${date}`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.number) {
        return response.status(400).json({ error : 'number missing' })
    }
    if(!body.name) {
        return response.status(400).json({ error : 'name missing' })
    }
    if(persons.some(p => p.name == body.name)){
        return response.status(400).json({ error : 'name must be unique' })
    }

    const person = {
        id : generateRandomId(),
        name : body.name,
        number : body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if(person) {
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})