const express = require('express')
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.use((request, response, next) => {
    request.requestTime = Date.now()
    next()
})

app.get('/info', (request, response) => {
    const entries = persons.length
    const requestTime = new Date(request.requestTime)
    let responseText = `<div>Phonebook has info for ${entries} people</div><br><div>${requestTime}</div>`
    response.send(responseText)

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})