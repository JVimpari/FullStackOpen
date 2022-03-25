const logger = require('./logger')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')

morgan.token('body', request => {
    return JSON.stringify(request.body, null, '\t')
})

const morganArgs = [
    (tokens, request, response) => { return tokens['body'](request,response) },
    { skip: request => {return Object.keys(request.body).length === 0 } }
]

const unknownEndpoint = (request, response) => {
    response.status(404).send( { error: 'unknown endpoint' } )
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).json({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        console.log(error)
        return response.status(400).json({ error: error.message })
    }
    else if (error.name === 'SyntaxError') {
        return response.status(400).json({ error: 'invalid request body' })
    }
    else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: error.message })
    }
    else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'token expired' })
    }
    response.status(500).json({ error: 'Something went wrong :)' })
    logger.error(error.stack)
    next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorizationArray = request.get('authorization')
    request.token =
        authorizationArray && authorizationArray.startsWith('Bearer')
            ? authorizationArray.substring(7)
            : null
    next()
}

const userExtractor = async (request, response, next) => {
    request.user = jwt.verify(request.token, process.env.SECRET)
    next()
}

module.exports = {
    morganArgs,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}