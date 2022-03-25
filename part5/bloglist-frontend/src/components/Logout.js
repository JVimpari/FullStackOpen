import React from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'
import DeleteUser from './DeleteUser'
import NotificationContext from './Notification'

const Logout = (props) => {
    const { user, setUser, ...others } = props

    const { dispatch } = NotificationContext.notificationConsumer()

    const handleLogout = () => {
        blogService.setToken(null)
        window.localStorage.removeItem('loggedBlogAppUser')
        setUser(null)
        dispatch({
            type: 'notification',
            message: `User '${user.name}' logged out!`
        })
    }
    return (
        <>
            <h3 id='loggedIn'>
                {`Logged in as: ${user.name}`}&emsp;
                <button id='logoutButton' onClick={() => handleLogout()}>Logout</button>&emsp;
                <DeleteUser user={user} handleLogout={handleLogout} {...others}/>
            </h3>
        </>
    )
}

Logout.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired
    }),
    setUser: PropTypes.func.isRequired
}
export default Logout