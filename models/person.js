const db = require("./db")

const personSchema = db.createSchema({ 
    name: { type : String, minLength : 3, required : true }, 
    number: { type : String, required : true }, 
})

module.exports = db.createModel('Person', personSchema)