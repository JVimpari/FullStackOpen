const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log('Invalid number of arguments.', '\n',
        'Display all entries: node command-line-mongo.js <password>', '\n',
        'Add new entry: node command-line-mongo.js <password> <name> <phonenumber>')
    process.exit(1)
}

const password = process.argv[2]

const databaseUrl =
    `mongodb+srv://AtlasMongoDBUser:${password}@atlasmongodbcluster.rzinq.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(databaseUrl)

const PhonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const PhonebookEntry = mongoose.model('PhonebookEntry', PhonebookSchema)

if (process.argv.length === 3) {
    PhonebookEntry
        .find({})
        .then(result => {
            console.log('Phonebook:')
            result.forEach(entry => {
                console.log(entry.name, entry.number)
            })
            mongoose.connection.close()
        })
}
if (process.argv.length === 5) {
    const entry = new PhonebookEntry({
        name: process.argv[3],
        number: process.argv[4]
    })

    entry.save().then(result => {
        console.log(`added ${result.name} ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}