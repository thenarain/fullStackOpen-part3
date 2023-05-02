const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Use appropriate command line parameter')
    process.exit(1)
}

const password = encodeURIComponent(process.argv[2])
const url = `mongodb+srv://kartiksrivastava19:${password}@cluster1.h50krin.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("phonebook:");
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`);
        })
        mongoose.connection.close()
    })
} else {
    const individual = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    individual.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}

