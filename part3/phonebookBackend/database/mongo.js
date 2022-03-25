const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const URI = process.env.MONGODB_URI

const NameRegex = /^[a-zA-ZÀ-ž]{1}([- ]?[a-zA-ZÀ-ž]){2,29}$/
//Regex: 1st must be alphabet or diacritic letter
//2-29 times optional '-' or 'space' followed by letter

const PhoneNumberRegex = /^[+]?[\d]{1}([- ]?\d{1}){7,14}$/
//Regex: Optional + at 1st, 1st or after + must be digit,
//7-14 times optional 'space' or '-' followed by digit which is must
//i.e. 8-15 digits in total and possible optional chars
//e.g. 12345678, +12345678, 1234 56-78, +1-23 4567-8 are valid

console.log('connecting to', URI)

mongoose.connect(URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to mongoDB:', error.message)
    })

const PhonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        match: [NameRegex, 'Invalid name format'],
        required: [true, 'Name is required'],
        unique: true
    },
    number: {
        type: String,
        match: [PhoneNumberRegex, 'Invalid phonenumber format'],
        required: [true, 'Phonenumber is required']
    }
})

PhonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

PhonebookSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator',
    message: '{PATH} must be unique'
})
module.exports = mongoose.model('PhonebookEntry', PhonebookSchema)