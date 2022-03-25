const lodash = require('lodash')

const dummy = (blogs) => {
    if(blogs) {
        return 1
    }
}

const totalLikes = (blogs) => {
    const total = blogs.reduce((prevValue, currValue) => { return prevValue + currValue.likes }, 0)
    return total
}

const favoriteBlog = (blogs) => {
    const favorite = blogs.reduce((prev, curr) => (prev.likes > curr.likes) ? prev : curr)
    return favorite
}

const mostBlogs = (blogs) => {
    const countblogs = lodash.map(lodash.countBy(blogs, 'author'), (val, key) => ({ author: key, blogs: val }))
    const mostblogs = lodash.maxBy(countblogs, 'blogs')
    return mostblogs
}

const mostLikes = (blogs) => {
    const countlikes =
    lodash(blogs)
        .groupBy('author')
        .map((val, key) => ({ author: key, likes: lodash.sumBy(val, 'likes') }))
        .value()
    const mostlikes = lodash.maxBy(countlikes, 'likes')
    return mostlikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}