import React from 'react'
import PropTypes from 'prop-types'
import loginService from '../services/login'
import blogService from '../services/blogs'
import FormInput from './FormInput'
import { useForm } from 'react-hook-form'
import NotificationContext from './Notification'

const Login = ( { setUser }) => {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const { dispatch } = NotificationContext.notificationConsumer()

    const handleLogin = async (data) => {
        try {
            const user = await loginService.login({
                username: data.Username,
                password: data.Password
            })
            blogService.setToken(user.token)
            window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
            setUser(user)
            dispatch({
                type: 'notification',
                message: `User '${user.name}' logged in!`
            })
        } catch (error) {
            dispatch({
                type: 'error',
                message: error.response.data.error
            })
        }
    }

    return (
        <div>
            <h2>Login to application</h2>
            <form id='loginForm' onSubmit={handleSubmit(handleLogin)}>
                <FormInput name='Username' register={register} errors={errors} />
                <FormInput name='Password' type='password' register={register} errors={errors} />
                <button id='loginButton' type='submit'>Login</button>
            </form>
        </div>
    )
}

Login.propTypes = {
    setUser: PropTypes.func.isRequired,
}


export default Login