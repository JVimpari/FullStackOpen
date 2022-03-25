import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, waitFor } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import { blogs, creatorUser, errorFromBackend } from './test_data'
import Logout from '../components/Logout'
import userService from '../services/user'
import blogService from '../services/blogs'
import NotificationContext from '../components/Notification'
import userEvent from '@testing-library/user-event'

describe('<Logout />', () => {
    const mocksetBlogs = jest.fn()
    const mocksetUser = jest.fn()
    blogService.setToken = jest.fn()
    userService.getUserId = jest.fn()
    userService.deleteUser = jest.fn()
    const mockDispatch = jest.fn()
    NotificationContext.notificationConsumer = jest.fn()

    beforeEach(() => {
        NotificationContext.notificationConsumer.mockImplementation(() => ({ dispatch: mockDispatch }))
    })

    afterEach(() => cleanup())

    const renderLogout = () => {
        const { container, getByRole, getByText } = render(
            <Logout
                user={creatorUser}
                setUser={mocksetUser}
                blogs={blogs}
                setBlogs={mocksetBlogs}
            />
        )
        return { container, getByRole, getByText }
    }

    test('Shows who has logged in, logout and delete user buttons', () => {
        const { container, getByRole, getByText } = renderLogout()
        expect(container).toContainElement(getByText(/Logged in as:/))
        expect(container).toContainElement(getByRole('button', { name: 'Logout' }))
        expect(container).toContainElement(getByRole('button', { name: 'Delete User' }))
    })

    test('User logs out succesfully', () => {
        const { getByRole } = renderLogout()
        userEvent.click(getByRole('button', { name: 'Logout' }))
        expect(blogService.setToken).toHaveBeenCalledTimes(1)
        expect(mocksetUser).toHaveBeenCalledTimes(1)
        //Notification is called with correct arguments
        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(mockDispatch).toHaveBeenLastCalledWith({
            type: 'notification',
            message: `User '${creatorUser.name}' logged out!`
        })
    })

    describe('<DeleteUser />',() => {
        test('User and blogs added by user are deleted succesfully', async () => {
            userService.getUserId.mockImplementationOnce(() => creatorUser.id)
            window.confirm = jest.fn(() => true)
            const { getByRole } = renderLogout()
            await waitFor(() => {
                userEvent.click(getByRole('button', { name: 'Delete User' }))
            })
            expect(userService.deleteUser).toHaveBeenCalledTimes(1)
            expect(userService.deleteUser).toHaveBeenLastCalledWith(creatorUser.id)
            //state update is called with list where blogs that user created have been removed
            expect(mocksetBlogs).toHaveBeenCalledTimes(1)
            expect(mocksetBlogs).toHaveBeenLastCalledWith([blogs[1]])
            //Notification is called with correct arguments
            expect(mockDispatch).toHaveBeenCalledTimes(2)
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'notification',
                message: `User '${creatorUser.name}' logged out!`
            })
            expect(mockDispatch).toHaveBeenLastCalledWith({
                type: 'notification',
                message: `Credentials for user: ${creatorUser.name} have been deleted`
            })
        })

        test('Does not delete user and created blog if confirm is cancelled', async () => {
            window.confirm = jest.fn(() => false)
            const { container, getByRole, getByText } = renderLogout()
            await waitFor(() => {
                userEvent.click(getByRole('button', { name: 'Delete User' }))
            })
            //does not call delete
            expect(userService.deleteUser).toHaveBeenCalledTimes(0)
            //rendering stays as it was
            expect(container).toContainElement(getByText(/Logged in as:/))
            expect(container).toContainElement(getByRole('button', { name: 'Logout' }))
            expect(container).toContainElement(getByRole('button', { name: 'Delete User' }))
        })

        test('User delete fails if error with the backend', async () => {
            userService.deleteUser.mockImplementationOnce(() => { throw errorFromBackend })
            window.confirm = jest.fn(() => true)
            const { getByRole } = renderLogout()
            await waitFor(() => {
                userEvent.click(getByRole('button', { name: 'Delete User' }))
            })
            //does not call state update
            expect(mocksetBlogs).toHaveBeenCalledTimes(0)
            //error is catched accordingly, and notification is called with correct arguments
            expect(mockDispatch).toHaveBeenCalledTimes(1)
            expect(mockDispatch).toHaveBeenLastCalledWith({
                type: 'error',
                message: 'some error from backend'
            })
        })
    })
})