import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, waitFor } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import { newUser, errorFromBackend } from './test_data'
import userService from '../services/user'
import CreateUser from '../components/CreateUser'
import NotificationContext from '../components/Notification'
import userEvent from '@testing-library/user-event'

describe('<CreateUser />', () => {

    const mockDispatch = jest.fn()
    NotificationContext.notificationConsumer = jest.fn()

    beforeEach(() => {
        NotificationContext.notificationConsumer.mockImplementation(() => ({ dispatch: mockDispatch }))
    })

    afterEach(() => cleanup())

    const renderCreateUser = () => {
        const { container, getByRole, getByLabelText, getByText } = render(
            <CreateUser />
        )
        const createUserForm = container.querySelector('#createUserForm')
        return { container, getByRole, getByLabelText, getByText, createUserForm }
    }

    test('<ToggleVisible /> does not show new user form by default', async () => {
        const { container, getByRole, createUserForm } = renderCreateUser()
        expect(createUserForm).not.toContainElement(container.querySelector('form'))
        expect(createUserForm).toContainElement(getByRole('button', { name: 'Create new user' }))
    })

    test('<ToggleVisible /> shows new user form by when button is clicked', () => {
        const { container, getByRole, createUserForm } = renderCreateUser()
        userEvent.click(getByRole('button', { name: 'Create new user' }))
        expect(createUserForm).toContainElement(container.querySelector('form'))
        expect(createUserForm).toContainElement(getByRole('button', { name: 'Cancel' }))
    })

    test('<ToggleVisible /> hides new user form when cancel button is clicked', () => {
        const { container, getByRole, createUserForm } = renderCreateUser()
        userEvent.click(getByRole('button', { name: 'Create new user' }))
        userEvent.click(getByRole('button', { name: 'Cancel' }))
        expect(createUserForm).not.toContainElement(container.querySelector('form'))
    })

    test('Submitting valid new user', async () => {
        //no backend -> user is returned manually
        userService.create = jest.fn(user => user)
        const { container, getByRole, getByLabelText, createUserForm } = renderCreateUser()
        userEvent.click(getByRole('button', { name: 'Create new user' }))
        userEvent.type(getByLabelText('Username:'), newUser.username)
        userEvent.type(getByLabelText('Name:'), newUser.name)
        userEvent.type(getByLabelText('Password:'), newUser.password)
        await waitFor(() => {
            userEvent.click(getByRole('button', { name: 'Create user' }))
        })
        expect(userService.create).toHaveBeenCalledTimes(1)
        expect(userService.create).toHaveBeenLastCalledWith(newUser)
        //closes form automatically when user is created
        expect(createUserForm).not.toContainElement(container.querySelector('form'))
        //notification is called with correct arguments
        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(mockDispatch).toHaveBeenLastCalledWith({
            type: 'notification',
            message: `User: ${newUser.username} created for ${newUser.name}`
        })
    })

    test('Shows error messages if user validation fails', async () => {
        userService.create = jest.fn()
        const { getByRole, getByLabelText, getByText, createUserForm } = renderCreateUser()
        userEvent.click(getByRole('button', { name: 'Create new user' }))
        userEvent.type(getByLabelText('Username:'), 'a')
        userEvent.type(getByLabelText('Password:'), 'b')
        await waitFor(() => {
            userEvent.click(getByRole('button', { name: 'Create user' }))
        })
        expect(createUserForm).toContainElement(getByText(/Must have 3-30 characters, alphanumeric, - and _ are allowed/))
        expect(createUserForm).toContainElement(getByText(/Name is required/))
        expect(createUserForm).toContainElement(getByText(/Must have 3-30 characters, whitespaces are not allowed/))
        expect(userService.create).toHaveBeenCalledTimes(0)
    })

    test('Submitting fails for valid new user if error with the backend', async () => {
        userService.create = jest.fn(() => { throw errorFromBackend })
        const { getByRole, getByLabelText } = renderCreateUser()
        userEvent.click(getByRole('button', { name: 'Create new user' }))
        userEvent.type(getByLabelText('Username:'), newUser.username)
        userEvent.type(getByLabelText('Name:'), newUser.name)
        userEvent.type(getByLabelText('Password:'), newUser.password)
        await waitFor(() => {
            userEvent.click(getByRole('button', { name: 'Create user' }))
        })
        //error is catched accordingly, and notification is called with correct arguments
        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(mockDispatch).toHaveBeenLastCalledWith({
            type: 'error',
            message: 'some error from backend'
        })
    })

})