const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const setUserForToken = async (username_to_set) => {
    await User.deleteOne({ username: username_to_set })
    const user = new User({
        username: username_to_set,
        password: 'secret'
    })
    return await user.save()
}

const getToken = async (username_for_token) => {
    const user = await User.findOne({ username: username_for_token })
    return jwt.sign(
        { username: user.username, id: user._id },
        process.env.SECRET,
        { expiresIn: '1m' }
    )
}

const getInvalidSignatureToken = async () => {
    const user = await User.findOne({ username: 'user_for_token' })
    return jwt.sign(
        { username: user.username, id: user._id },
        'Invalid key',
        { expiresIn: '1m' }
    )
}

const getExpiredToken = async () => {
    const user = await User.findOne({ username: 'user_for_token' })
    return jwt.sign(
        { username: user.username, id: user._id, exp: Math.floor(Date.now() / 1000) - 1000 },
        process.env.SECRET
    )
}

const getNotBeforeToken = async () => {
    const user = await User.findOne({ username: 'user_for_token' })
    return jwt.sign(
        { username: user.username, id: user._id, nbf: Math.floor(Date.now() / 1000 + 1000 ) },
        process.env.SECRET,
        { expiresIn: '1m' }
    )
}

module.exports = {
    blogsInDb,
    usersInDb,
    setUserForToken,
    getToken,
    getInvalidSignatureToken,
    getExpiredToken,
    getNotBeforeToken
}