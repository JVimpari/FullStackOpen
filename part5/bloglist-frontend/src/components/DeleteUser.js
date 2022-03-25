import React from 'react'
import PropTypes from 'prop-types'
import userService from '../services/user'
import NotificationContext from './Notification'

const DeleteUser = (props) => {
    const { user, blogs, setBlogs, handleLogout } = props
    const id = userService.getUserId()

    const { dispatch } = NotificationContext.notificationConsumer()

    const handleUserDelete = async (id) => {
        if (window.confirm(
            `Do you really want to delete user: ${user.username}?\n`+
            'All the blogs user has added will be also removed.'
        )) {
            try {
                await userService.deleteUser(id)
                handleLogout()
                setBlogs(blogs.filter(blog => blog.user.id !== id))
                dispatch({
                    type: 'notification',
                    message: `Credentials for user: ${user.name} have been deleted`
                })
            } catch (error) {
                dispatch({
                    type: 'error',
                    message: error.response.data.error
                })
            }
        }
    }
    return (
        <button id='deleteUserButton' onClick={() => handleUserDelete(id)}>Delete User</button>
    )
}

DeleteUser.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
    }).isRequired,
    blogs: PropTypes.arrayOf(PropTypes.object),
    setBlogs: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired,
}

export default DeleteUser