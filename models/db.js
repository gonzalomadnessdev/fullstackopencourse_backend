const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  console.log('connected to MongoDB')
})
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const createSchema = (schemaObj) => {
  const schema = new mongoose.Schema(schemaObj)

  schema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  return schema
}

const createModel = (name, schema) => {
  return mongoose.model(name, schema)
}

module.exports = { createSchema, createModel }