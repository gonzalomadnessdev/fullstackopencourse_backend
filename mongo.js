const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://gonzalohralbornoz:${password}@cluster0.vqa2x.mongodb.net/`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema()
const Person = mongoose.model('Person', { name: String , number: String });

let promise;
if(process.argv.length === 5){
    const personObj = { name : process.argv[3], number : process.argv[4] }
    const person = new Person({...personObj})
    promise = person.save()
        .then((person)=> console.log(`addded ${person.name} number ${person.number} to phonebook`))
}else{
    console.log("phonebook:")
    promise = Person.find()
        .then((persons) => persons.forEach((p)=> console.log(`${p.name} ${p.number}`)))
}

promise.then(()=> mongoose.connection.close())