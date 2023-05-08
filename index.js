require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
const Person = require('./models/person')

morgan.token("body", (request) => {
  return request.body;
});

const app = express();
app.use(cors())
app.use(express.static('build'))
app.use(express.json());

const assignBodyJson = (request, response, next) => {
  request.body = JSON.stringify(request.body);
  next();
};

app.use(assignBodyJson);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response, next) => {
  Person.find({}).then(result => {
    response.json(result)
  }).catch(error => next(error))
});

app.use((request, response, next) => {
  request.requestTime = Date.now();
  next();
});

app.get("/info", (request, response) => {
  const requestTime = new Date(request.requestTime);
  Person.countDocuments({}).then(result => {
    console.log(result);
    let responseText = `<div>Phonebook has info for ${result} people</div><br><div>${requestTime}</div>`;
    response.send(responseText);
  }).catch(error => next(error))
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((n) => n.id === id);

  if (!person) {
    response.status(404).end();
  } else {
    response.json(person);
  }
});

app.put("/api/persons/:id", (request, response) =>{
  const body = JSON.parse(request.body)

  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true }).then(updatetedContact => {
    response.json(updatetedContact)
  }).catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
});

app.post("/api/persons", (request, response) => {
  const body = JSON.parse(request.body);

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const contact = new Person({
    name: body.name,
    number: body.number,
  })

  contact.save().then(savedContact => {
    response.json(savedContact)
  }).catch(error => next(error))
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(404).send({ error: 'malformatted id' })
  }
}

app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
