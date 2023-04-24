const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
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
  const id = Number(request.params.id);
  persons = persons.filter((n) => n.id !== id);
  response.status(204).end();
});

const generateId = (range) => {
  const newId = Math.floor(Math.random() * range);
  return newId;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const contact = {
    id: generateId(100),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(contact);
  response.json(contact);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
