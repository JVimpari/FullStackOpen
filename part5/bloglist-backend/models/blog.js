const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    author: {
        type: String,
        required: [true, 'Author is required']
    },
    url: {
        type: String,
        required: [true, 'URL is required']
    },
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

//remove blog reference from the user when blog is deleted
blogSchema.post('deleteOne', { document: true, query: false }, async function(doc, next) {
    const User = doc.model('User')
    const user = await User.findById(doc.user)
    await user.updateOne(
        { blogs: user.blogs.filter(blog => !blog.equals(doc._id)) }
    )
    next()
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
module.exports = mongoose.model('Blog', blogSchema)
