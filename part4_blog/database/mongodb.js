const mongoose = require('mongoose')
const logger = require('../utils/logger')
const config = require('../utils/config')

const connect = () => {
  if (mongoose.connection.readyState === 0) {
    mongoose.set('strictQuery', false)
    mongoose.connect(config.MONGODB_URI)
      .then(() => {
        logger.info('connected to MongoDB')
      })
      .catch(error => {
        logger.info('error connecting to MongoDB:', error.message)
      })
  }
}

const createModel = (name, schema, hiddenProperties = []) => {
  const _schema = new mongoose.Schema(schema)

  _schema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      if(hiddenProperties !== null){
        hiddenProperties.forEach(key => delete returnedObject[key])
      }
    }
  })

  return mongoose.model(name, _schema)
}

module.exports = { connect, createModel }