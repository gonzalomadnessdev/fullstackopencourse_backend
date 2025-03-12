const db = require('./db')

const personSchema = db.createSchema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    required: true,
    //match : [/^([0-9]{2,3})-([0-9]{1,})$/, "invalid phone number format"],
    validate: {
      validator: (value) => /^([0-9]{2,3})-([0-9]{1,})$/.test(value),
      message: 'invalid phone number format'
    }
  },
})

module.exports = db.createModel('Person', personSchema)