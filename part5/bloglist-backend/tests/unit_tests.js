const listHelper = require('../utils/list_helper')
const testdata = require('./test_data')
const blogs = testdata.blogs
const listWithOneBlog = testdata.listWithOneBlog

describe('Dummy', () => {
    test('dummy returns one', () => {
        const result = listHelper.dummy(blogs)
        expect(result).toBe(1)
    })
})

describe('Total likes', () => {
    test('When list has only 1 blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })
    test('Total sum of likes in all blog posts', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })
})

describe('Favorite blog', () => {
    test('Favoriteblog i.e. blog with most likes', () => {
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blogs[2])
    })
})

describe('Most blogs', () => {
    test('Author who has the largest amount of blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
    })
})

describe('Most likes', () => {
    test('Author who has the largest amount of likes', () => {
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
    })
})


