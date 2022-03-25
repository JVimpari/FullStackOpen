import React from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'
import NotificationContext from './Notification'

const UpdateBlog = (props) => {
    const { blog, blogs, setBlogs } = props

    const { dispatch } = NotificationContext.notificationConsumer()

    const handleUpdate = async (id) => {
        try {
            const blogAfter = { ...blog, likes: blog.likes + 1, user: blog.user.id }
            const updatedBlog = await blogService.update(id, blogAfter)
            setBlogs(blogs.map(blog => (blog.id === id) ? updatedBlog : blog).sort((a, b) => b.likes - a.likes))
            dispatch({
                type: 'notification',
                message: `Like added to blog: ${blog.title} by ${blog.author}`
            })
        } catch (error){
            dispatch({
                type: 'error',
                message: error.response.data.error
            })
        }
    }

    return (
        <li className='likesContainer'>
            Likes:&emsp;
            <span className='numberOfLikes'>
                {blog.likes}
            </span>&emsp;
            <button className='likeButton' onClick={() => handleUpdate(blog.id)}>Like</button>
        </li>
    )
}

UpdateBlog.propTypes = {
    blog: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        likes: PropTypes.number.isRequired,
        user: PropTypes.shape({
            id: PropTypes.string.isRequired
        })
    }),
    blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
    setBlogs: PropTypes.func.isRequired,
}

export default UpdateBlog