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
app.use(express.json());
app.use(express.static('build'))

const assignBodyJson = (request, response, next) => {
  request.body = JSON.stringify(request.body);
  next();
};

app.use(assignBodyJson);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
});

app.use((request, response, next) => {
  request.requestTime = Date.now();
  next();
});

app.get("/info", (request, response) => {
  const entries = persons.length;
  const requestTime = new Date(request.requestTime);
  let responseText = `<div>Phonebook has info for ${entries} people</div><br><div>${requestTime}</div>`;
  response.send(responseText);
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

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  })
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
  })
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
