const blogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    }
]

const listWithOneBlog = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    }
]

const validPostBlog = {
    title: 'Title for valid new blog',
    author: 'Author for valid new blog',
    url: 'http://www.url_for_valid_new_blog.com',
    likes: 1,
}

const blogWithMissingLikes = {
    title: 'Title for blog with missing likes',
    author: 'Author for blog with missing likes',
    url: 'http://www.url_for_blog_with_missing_likes.com'
}

const blogsWithInvalidData = [
    {
        author: 'Author for blog with missing title',
        url: 'http://www.url_for_blog_with_missing_title.com',
    },
    {
        title: 'Title for blog with missing author',
        url: 'http://www.url_for_blog_with_missing_author.com'
    },
    {
        title: 'Title for blog with missing url',
        author: 'Author for blog with missing url'
    }
]

const initialUsers = [
    {
        username: 'Initial_user1',
        name: 'initial name 1',
        password: 'secret1'
    },
    {
        username: 'Initial_user2',
        name: 'initial name 2',
        password: 'secret2'
    }
]

const validNewUser = {
    username: 'valid_username',
    name: 'valid name',
    password: 'secret',
}

const invalidUsers = [
    {
        name: 'username missing',
        password: 'secret'
    },
    {
        username: 'password_missing',
        name: 'password missing'
    },
    {
        username: 'ab',
        name: 'username is too short',
        password: 'secret'
    },
    {
        username: 'password_is_too_short',
        name: 'password is too short',
        password: 'ab'
    },
    {
        username: 'ab',
        name: 'both are too short',
        password: 'ab'
    },
    {
        username: 'invalid*user name!',
        name: 'invalid username',
        password: 'secret'
    },
    {
        username: 'spaces_in_password',
        name: 'spaces in password',
        password: 'spaces in password'
    }
]

const usernameTakenUser = {
    username: 'Initial_user1',
    name: 'username taken',
    password: 'secret',
}

const invalidBearerTokens = [
    '',
    'Bearer ',
    'Bearer this.is.invalid',
    'Bearer malformed_token',
]

const invalidLogins = [
    {
        username: 'non_existing',
        name: 'non existing',
        password: 'secret'
    },
    {
        username: 'valid_username',
        name: 'valid name',
        password: 'wrong_password'
    }
]

module.exports = {
    blogs,
    listWithOneBlog,
    validPostBlog,
    blogWithMissingLikes,
    blogsWithInvalidData,
    initialUsers,
    invalidUsers,
    validNewUser,
    usernameTakenUser,
    invalidBearerTokens,
    invalidLogins
}