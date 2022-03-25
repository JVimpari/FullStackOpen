const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const { blogsInDb, setUserForToken, getToken, getInvalidSignatureToken, getExpiredToken, getNotBeforeToken } = require('./test_helper')
const { ObjectId } = require('mongodb')

const { blogs, validPostBlog, blogWithMissingLikes, blogsWithInvalidData, invalidBearerTokens } = require('./test_data')

describe('Blog tests', () => {
    var token = null
    var user_for_token = null
    beforeAll(async () => {
        user_for_token = await setUserForToken('user_for_token')
        token = await getToken('user_for_token')
    })
    beforeEach(async () => {
        await Blog.deleteMany({})
        logger.info('Test database cleared')
        await Blog.insertMany(blogs)
        const user = await User.findOne({ username: 'user_for_token' })
        await Blog.updateMany({}, { user: user._id })
        const initialBlogs = await Blog.find({})
        await User.updateOne({ username: 'user_for_token' }, { blogs: initialBlogs.map(blog => blog._id) })
        logger.info('Test database reset done')
    })

    describe('GET /api/blogs', () => {
        test('Blogs returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('Returned correct amount of blog posts', async () => {
            const response = await api.get('/api/blogs')
            expect(response.body).toHaveLength(blogs.length)
        })

        test('Blog returned data contains sent data', async () => {
            const response = await api.get('/api/blogs')
            expect(response.body).toMatchObject(blogs)
        })
    })

    describe('toJSON method', () => {
        test('_id --> id and __v is removed', async () => {
            const response = await api.get('/api/blogs')
            response.body.forEach(blog => {
                expect(blog).toHaveProperty('id')
                expect(blog).not.toHaveProperty('_id')
                expect(blog).not.toHaveProperty('__v')
            })
        })
    })

    describe('POST /api/blogs', () => {
        test('Succeeds with status code 201 if data is valid', async () => {
            const response =
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(validPostBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            expect(response.body).toMatchObject(validPostBlog)
            const blogsAfter = await blogsInDb()
            expect(blogsAfter).toHaveLength(blogs.length +1)
        })

        test('Likes defaults to 0 if its property missing', async () => {
            const response =
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(blogWithMissingLikes)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            expect(response.body).toHaveProperty('likes', 0)
            const blogsAfter = await blogsInDb()
            expect(blogsAfter).toHaveLength(blogs.length + 1)
        })

        test('Fails with status code 400 if any other property missing', async () => {
            for (const blog of blogsWithInvalidData) {
                await api
                    .post('/api/blogs')
                    .set('Authorization', `Bearer ${token}`)
                    .send(blog)
                    .expect(400)
            }
        })

        test('Fails with status code 400 if request body is not json', async () => {
            const invalidReqBody = 'This string is not json'
            await api
                .post('/api/blogs')
                .set({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` })
                .send(invalidReqBody)
                .expect(400)
        })

        test('POST fails with status code 401 if token is invalid', async () => {
            const invalidTokens = invalidBearerTokens.concat(`Bearer ${await getInvalidSignatureToken()}`)
            for (const invalidToken of invalidTokens) {
                await api
                    .post('/api/blogs')
                    .set('Authorization', invalidToken)
                    .send(validPostBlog)
                    .expect(401)
            }
        })

        test('POST fails with status code 401 if token is expired', async () => {
            const expiredToken = await getExpiredToken()
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${expiredToken}`)
                .send(validPostBlog)
                .expect(401)
        })
    })

    describe('DELETE /api/blogs/:id', () => {
        test('Succeeds with status code 204 if id is valid', async () => {
            const blogsBefore = await blogsInDb()
            await api
                .delete(`/api/blogs/${blogsBefore[0].id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)
            const blogsAfter = await blogsInDb()
            const userAfter = await User.findById(blogsBefore[0].user)
            expect(blogsAfter).not.toContain(blogsBefore[0])
            expect(userAfter.blogs).not.toContain(blogsBefore[0].id)
            expect(blogsAfter).toHaveLength(blogsBefore.length - 1)
        })

        test('Does nothing with status code 404 if valid but non existing id', async () => {
            const validNonExistingId = ObjectId().toString()
            await api
                .delete(`/api/blogs/${validNonExistingId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404)
            const allBlogs = await blogsInDb()
            expect(allBlogs).toHaveLength(blogs.length)
        })

        test('Fails with status code 400 if id is invalid', async () => {
            await api
                .delete('/api/blogs/12345')
                .set('Authorization', `Bearer ${token}`)
                .expect(400)
        })

        test('DELETE fails with status code 401 if token is invalid', async () => {
            const invalidTokens = invalidBearerTokens.concat(`Bearer ${await getInvalidSignatureToken()}`)
            const blogsBefore = await blogsInDb()
            for (const invalidToken of invalidTokens) {
                await api
                    .delete(`/api/blogs/${blogsBefore[0].id}`)
                    .set('Authorization', invalidToken)
                    .expect(401)
            }
        })

        test('DELETE fails with status code 401 if token is expired', async () => {
            const expiredToken = await getExpiredToken()
            const blogsBefore = await blogsInDb()
            await api
                .delete(`/api/blogs/${blogsBefore[0].id}`)
                .set('Authorization', `Bearer ${expiredToken}`)
                .expect(401)
        })

        test('Fails with status code 403 if non creator tries to delete', async () => {
            const blogsBefore = await blogsInDb()
            await setUserForToken('user_non_creator')
            const token_non_creator = await getToken('user_non_creator')
            await api
                .delete(`/api/blogs/${blogsBefore[0].id}`)
                .set('Authorization', `Bearer ${token_non_creator}`)
                .expect(403)
        })
    })

    describe('PUT /api/blogs/:id', () => {
        var validPutBlog = null
        console.log(typeof validPostBlog)
        beforeAll(async () => {
            validPutBlog = { ...validPostBlog, user: user_for_token._id.toString() }
        })
        test('Succeeds with status code 200 if valid', async () => {
            const blogsBefore = await Blog.find({})
            await api
                .put(`/api/blogs/${blogsBefore[0].id}`)
                .send(validPutBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            const blogsAfter = await blogsInDb()
            expect(blogsAfter[0]).toMatchObject({ ...validPutBlog, user: user_for_token._id })
            expect(blogsAfter).toHaveLength(blogsBefore.length)
        })

        test('Fails with statuscode 400 if id is invalid', async () => {
            await api
                .put('/api/blogs/12345')
                .expect(400)
        })

        test('Fails with statuscode 404 if valid but non existing id', async () => {
            const validNonExistingId = ObjectId().toString()
            await api
                .put(`/api/blogs/${validNonExistingId}`)
                .send(validPutBlog)
                .expect(404)
        })
    })

    describe('Forced unhandled error', () => {
        test('Fails with status code 500 with forged token', async () => {
            const notBeforeToken = await getNotBeforeToken()
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${notBeforeToken}`)
                .send(validPostBlog)
                .expect(500)
        })
    })
})
