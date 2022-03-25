const usersRouter = require('express').Router()
const User = require('../models/user')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response) => {
    const user = new User({
        username: request.body.username,
        name: request.body.name,
        password: request.body.password,
    })
    const savedUser = await user.save()
    response.status(201).json(savedUser.toJSON())
})

usersRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response, next) => {
    const user = await User.findById(request.params.id)
    if (user) {
        if (user._id.toString() === request.user.id) {
            await user.deleteOne()
            response.status(204).end()
        } else {
            response.status(403).json({ error: `Only ${user.username} can delete themself` })
        }
    } else {
        next()
    }
})

module.exports = usersRouter