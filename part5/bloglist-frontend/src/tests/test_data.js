import { ObjectId } from 'mongodb'

const creatorId = ObjectId().toString()
const nonCreatorId = ObjectId.toString()

const blogs = [
    {
        id: ObjectId().toString(),
        title: 'Title for first blog',
        author: 'Author for first blog',
        url: 'https://url_for_first_blog.com/',
        likes: 5,
        user: {
            id: creatorId,
            name: 'Name for creator',
            username: 'username_for_creator'
        }
    },
    {
        id: ObjectId().toString(),
        title: 'Title for second blog',
        author: 'Author for second blog',
        url: 'https://url_for_second_blog.com',
        likes: 2,
        user: {
            id: nonCreatorId,
            name: 'Non creator',
            username: 'non_creator'
        }
    }
]

const newBlog = {
    title: 'New title',
    author: 'New Author',
    url: 'http://New_url.com'
}

const creatorUser = { ...blogs[0].user }

const nonCreatorUser = { ...blogs[1].user }

const newUser = {
    username: 'new_username',
    name: 'new name',
    password: 'secret'
}

const userForLogin = {
    username: 'user_for_login',
    password: 'secret'
}

const signedUser = {
    username: userForLogin.username,
    name: 'user for login',
    token: 'xxx.yyy.zzz'
}

const errorFromBackend = {
    response: {
        data: {
            error: 'some error from backend'
        }
    }
}

export { blogs, newBlog, creatorUser, nonCreatorUser, newUser, userForLogin, signedUser, errorFromBackend }