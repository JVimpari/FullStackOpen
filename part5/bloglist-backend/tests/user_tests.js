const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const { initialUsers, validNewUser, invalidUsers, usernameTakenUser, blogs } = require('./test_data')
const { usersInDb, getToken, setUserForToken, blogsInDb } = require('./test_helper')
const { ObjectId } = require('mongodb')

describe('User tests', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        logger.info('User test database cleared')
        await User.create(initialUsers)
        logger.info('User test database reset done')
    })
    describe('GET /api/users', () => {
        test('Users Returned as json', async () => {
            await api
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('Returned correct amount of users', async () => {
            const response = await api.get('/api/users')
            expect(response.body).toHaveLength(initialUsers.length)
        })

        test('User returned data contain sent data', async () => {
            const response = await api.get('/api/users')
            const allUsers = await usersInDb()
            expect(allUsers).toMatchObject(response.body)
        })
    })

    describe('POST /api/users', () => {
        test('Succeeds with status code 201 if user is valid', async () => {
            const usersAtStart = await usersInDb()
            const response =
            await api
                .post('/api/users')
                .send(validNewUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            const usersAtEnd = await usersInDb()
            expect(usersAtEnd).toContainEqual(response.body)
            expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        })

        test('Fails with status code 400 if data is invalid', async () => {
            for (const user of invalidUsers) {
                await api
                    .post('/api/users')
                    .send(user)
                    .expect(400)
            }
            const usersAtEnd = await usersInDb()
            expect(usersAtEnd).toHaveLength(initialUsers.length)
        })

        test('Fails with status code 400 if username is taken', async () => {
            await api
                .post('/api/users')
                .send(usernameTakenUser)
                .expect(400)
            const usersAtEnd = await usersInDb()
            expect(usersAtEnd).toHaveLength(initialUsers.length)
        })
    })

    describe('DELETE /api/users', () => {
        beforeEach(async () => {
            await Blog.deleteMany({})
            await Blog.insertMany(blogs)
        })

        test('User delete succeeds with status code 204 if user is valid', async () => {
            const user_for_token = await setUserForToken('user_for_token')
            const token = await getToken('user_for_token')
            const usersAtStart = await usersInDb()
            const blogsBefore = await blogsInDb()
            const blog = await Blog.findByIdAndUpdate(blogsBefore[0].id, { user: user_for_token }, { new: true })
            await user_for_token.updateOne({ blogs: blog._id })
            await api
                .delete(`/api/users/${user_for_token._id.toString()}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)
            const usersAtEnd = await usersInDb()
            const blogsAfter = await blogsInDb()
            console.log('blogsafter')
            expect(usersAtEnd).not.toContain(user_for_token)
            expect(blogsAfter).not.toContain(blog)
            expect(usersAtEnd).toHaveLength(usersAtStart.length - 1)
            expect(blogsAfter).toHaveLength(blogsBefore.length - 1)
        })

        test('User delete fails with status code 403 if some other user tries do delete', async () => {
            await setUserForToken('some_one_else')
            const token = await getToken('some_one_else')
            const usersAtStart = await usersInDb()
            await api
                .delete(`/api/users/${usersAtStart[0].id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(403)
            const usersAtEnd = await usersInDb()
            expect(usersAtEnd).toEqual(usersAtStart)
        })

        test('User delete fails with status code 404 if valid but non existing id', async () => {
            await setUserForToken('user_for_token')
            const token = await getToken('user_for_token')
            const validNonExistingId = ObjectId().toString()
            const usersAtStart = await usersInDb()
            await api
                .delete(`/api/users/${validNonExistingId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404)
            const usersAtEnd = await usersInDb()
            expect(usersAtEnd).toEqual(usersAtStart)
        })
    })
})
