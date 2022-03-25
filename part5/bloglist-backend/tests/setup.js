const config = require('../utils/config')
const logger = require('../utils/logger')
const mongoose = require('mongoose')

beforeAll(() => {
    logger.info('connecting to', config.MONGODB_URI)
    mongoose.connect(config.MONGODB_URI)
        .then(() => {
            logger.info('connected to MongoDB')
        })
        .catch((error) => {
            logger.error('error connecting to MongoDB', error.message)
        })

})

afterAll(async () => {
    await mongoose.connection.close()
})
