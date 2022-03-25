if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const PhonebookEntry = require('./database/mongo')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

const errorHandler = (error, request, response, next) => {
    console.log(error.errors)
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        const validationErrors = {
            'error': 'Invalid input',
            'details': {},
        }
        Object.keys(error.errors).forEach(elem => {
            validationErrors.details[elem] = {
                'validator': error.errors[elem].kind,
                'message': error.errors[elem].properties.message
            }
        })
        return response.status(400).json(validationErrors)
    }
    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

morgan.token('body', function (request) {
    return JSON.stringify(request.body, null, '\t')
})

app.use('/api/persons', morgan(':body', {
    skip: function (request) {return request.method !== 'POST'} }
))

app.get('/api/persons', (request, response, next) => {
    PhonebookEntry
        .find({})
        .then(entries => {
            response.json(entries.map(entry => entry.toJSON()))
        })
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    let date = new Date()
    PhonebookEntry
        .countDocuments({})
        .then(count => {
            response.send(`Phonebook has info for ${count} people` + '<br>' + date)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    PhonebookEntry
        .findById(request.params.id)
        .then(entry => {
            if (entry) {
                response.json(entry.toJSON())
            }
            else {
                response.status(404).json({
                    error: `Information not found with id: '${request.params.id}'`
                })
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    PhonebookEntry
        .findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const newEntry = new PhonebookEntry({
        name: request.body.name,
        number: request.body.number,
    })

    newEntry.save()
        .then(savedEntry => {
            response.json(savedEntry.toJSON())
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const Entry = {
        name: request.body.name,
        number: request.body.number
    }
    PhonebookEntry
        .findByIdAndUpdate(request.params.id, Entry, { new: true, runValidators: true, context: 'query' })
        .then(updatedEntry => {
            response.json(updatedEntry.toJSON())
        })
        .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})