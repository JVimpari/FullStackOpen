import React from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'
import userService from '../services/user'
import NotificationContext from './Notification'

const DeleteBlog = (props) => {
    const { user, blog, blogs, setBlogs } = props
    const id = userService.getUserId()

    const { dispatch } = NotificationContext.notificationConsumer()

    const handleBlogDelete = async (id) => {
        if (window.confirm(`Do you really want to delete blog: ${blog.title} by ${blog.author}`)) {
            try {
                await blogService.remove(id)
                setBlogs(blogs.filter(blog => blog.id !== id))
                dispatch({
                    type: 'notification',
                    message: `User ${user.name} deleted blog ${blog.title} by ${blog.author}`
                })
            } catch (error) {
                dispatch({
                    type: 'error',
                    message: error.response.data.error
                })
            }
        }
    }
    if (id !== blog.user.id) {
        return null
    }
    return (
        <li>
            <button className='deleteBlogButton' onClick={() => handleBlogDelete(blog.id)}>Delete</button>
        </li>
    )
}

DeleteBlog.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired
    }).isRequired,
    blog: PropTypes.shape({
        user: PropTypes.shape({
            id: PropTypes.string.isRequired
        }).isRequired,
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired
    }).isRequired,
    blogs: PropTypes.arrayOf(PropTypes.object),
    setBlogs: PropTypes.func.isRequired,
}

export default DeleteBlog