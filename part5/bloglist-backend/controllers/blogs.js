const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { tokenExtractor, userExtractor } = require('../utils/middleware')
const { ObjectId } = require('mongodb')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.status(200).json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
    const user = await User.findById(request.user.id)
    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    await user.updateOne({ blogs: user.blogs.concat(savedBlog._id) })
    await new Promise(resolve => savedBlog.populate('user', { username: 1, name: 1 }, resolve))
    response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response, next) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        const user = await User.findById(blog.user.toString())
        if (blog.user.toString() === request.user.id) {
            await blog.deleteOne()
            response.status(204).end()
        } else {
            response.status(403).json({ error: `Only ${user.username} can delete this blog` })
        }
    } else {
        next()
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const blog = {
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
        user: ObjectId(request.body.user)
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        blog,
        { new: true, runValidators: true, context: 'query' }
    )
    if (updatedBlog) {
        await new Promise(resolve => updatedBlog.populate('user', { username: 1, name: 1 }, resolve))
        response.status(200).json(updatedBlog.toJSON())
    } else {
        next()
    }
})

module.exports = blogsRouter