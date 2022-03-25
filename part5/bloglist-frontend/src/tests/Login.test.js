import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, waitFor } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import { userForLogin, signedUser, errorFromBackend } from './test_data'
import Login from '../components/Login'
import blogService from '../services/blogs'
import loginService from '../services/login'
import NotificationContext from '../components/Notification'
import userEvent from '@testing-library/user-event'

describe('<Login />', () => {

    const mocksetUser = jest.fn()
    loginService.login = jest.fn()
    blogService.setToken = jest.fn()
    const mockDispatch = jest.fn()
    NotificationContext.notificationConsumer = jest.fn()

    beforeEach(() => {
        NotificationContext.notificationConsumer.mockImplementation(() => ({ dispatch: mockDispatch }))
    })

    afterAll(() => cleanup())

    const renderLogin = () => {
        const { container, getByRole, getByText, getByLabelText } = render(
            <Login setUser={mocksetUser} />
        )
        const loginForm = container.querySelector('#loginForm')
        return { container, getByRole, getByText, getByLabelText, loginForm }
    }

    test('Login form is rendered', () => {
        const { getByRole, getByLabelText, loginForm } = renderLogin()
        expect(loginForm).toContainElement(getByLabelText('Username:'))
        expect(loginForm).toContainElement(getByLabelText('Password:'))
        expect(loginForm).toContainElement(getByRole('button', { name: 'Login' }))
    })

    test('User is logged in succesfully', async () => {
        loginService.login.mockImplementationOnce(() => signedUser)
        const { getByRole, getByLabelText } = renderLogin()
        userEvent.type(getByLabelText('Username:'), userForLogin.username)
        userEvent.type(getByLabelText('Password:'), userForLogin.password)
        await waitFor(() => {
            userEvent.click(getByRole('button', { name: 'Login' }))
        })
        expect(loginService.login).toHaveBeenCalledTimes(1)
        expect(loginService.login).toHaveBeenLastCalledWith(userForLogin)
        expect(blogService.setToken).toHaveBeenCalledTimes(1)
        expect(blogService.setToken).toHaveBeenLastCalledWith(signedUser.token)
        expect(mocksetUser).toHaveBeenCalledTimes(1)
        expect(mocksetUser).toHaveBeenLastCalledWith(signedUser)
        //Notification is called with correct arguments
        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(mockDispatch).toHaveBeenLastCalledWith({
            type: 'notification',
            message: `User '${signedUser.name}' logged in!`
        })
    })

    test('Shows error messages if login validation fails', async () => {
        const { getByRole, getByText, loginForm } = renderLogin()
        await waitFor(() => {
            userEvent.click(getByRole('button', { name: 'Login' }))
        })
        expect(loginForm).toContainElement(getByText(/Username is required/))
        expect(loginForm).toContainElement(getByText(/Password is required/))
        expect(loginService.login).toHaveBeenCalledTimes(0)
    })

    test('User login fails if incorrect credentials', async () => {
        loginService.login.mockImplementationOnce(() => { throw errorFromBackend })
        const { getByRole, getByLabelText } = renderLogin()
        userEvent.type(getByLabelText('Username:'), userForLogin.username)
        userEvent.type(getByLabelText('Password:'), 'wrong_password')
        await waitFor(() => {
            userEvent.click(getByRole('button', { name: 'Login' }))
        })
        expect(loginService.login).toHaveBeenCalledTimes(1)
        expect(blogService.setToken).toHaveBeenCalledTimes(0)
        expect(mocksetUser).toHaveBeenCalledTimes(0)
        //error is catched accordingly, and notification is called with correct arguments
        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(mockDispatch).toHaveBeenLastCalledWith({
            type: 'error',
            message: 'some error from backend'
        })
    })

})