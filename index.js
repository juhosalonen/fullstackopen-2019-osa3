
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())

morgan.token('data', function getData(request) {
    if (request.method === "POST") {
        return JSON.stringify(request.body)
    }
    else return ""
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [

    {
        "name": "Arto Hellas",
        "number": "045-1236543",
        "id": 3
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 4
    },
    {
        "name": "Lea Kutvonen",
        "number": "050-123123",
        "id": 5
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 6
    }
]

app.get('/info', (req, res) => {
    res.send(
        '<div>Puhelinluettelossa ' + persons.length + ' henkilön tiedot </div>' + new Date()
    )
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    if (persons.map(n => n.name).includes(person.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    person.id = Math.floor(Math.random() * 1000)
    persons = persons.concat(person)


    response.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})