const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')

const usernameRegex = /^[a-zA-Z\d-_]{3,30}$/
//Username must be 3-30 characters, alphabet, digits, '-' and '_' are allowed

const passwordRegex = /^\S{3,30}$/
//password must be 3-30 characters, anything else than spaces, tabs or linebreaks

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        match: [usernameRegex, 'Invalid username format'],
        unique: true
    },
    name: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        match: [passwordRegex, 'Password must be at least 3 characters long']
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
})

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10)
    next()

})

//Delete orphaned blogs if owner user is deleted
userSchema.post('deleteOne', { document: true, query: false }, async function(doc, next) {
    const Blog = doc.model('Blog')
    await Blog.deleteMany(
        { user: doc._id }
    )
    next()
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.password
    }
})
userSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator',
    message: '{PATH} must be unique'
})

module.exports = mongoose.model('User', userSchema)

