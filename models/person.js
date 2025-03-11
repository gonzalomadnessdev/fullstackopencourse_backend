const db = require("./db")

const personSchema = db.createSchema({ name: String, number: String })

module.exports = db.createModel('Person', personSchema)