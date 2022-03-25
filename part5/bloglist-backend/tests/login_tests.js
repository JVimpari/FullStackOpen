const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const logger = require('../utils/logger')
const { validNewUser, invalidLogins } = require('./test_data')

describe('Login tests', () => {
    beforeAll(async () => {
        await User.deleteMany({})
        logger.info('User test database cleared')
        await User.create(validNewUser)
        logger.info('User test database reset done')
    })

    describe('POST /api/login', () => {
        test('Succeeds with status code 200 if credentials match', async () => {
            const response =
            await api
                .post('/api/login')
                .send(validNewUser)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            expect(response.body).toEqual(
                expect.objectContaining({
                    username: validNewUser.username,
                    name: validNewUser.name
                })
            )
        })

        test('Fails with status code 401 if invalid username or password', async () => {
            for (const invalidLogin of invalidLogins) {
                await api
                    .post('/api/login')
                    .send(invalidLogin)
                    .expect(401)
            }
        })
    })
})