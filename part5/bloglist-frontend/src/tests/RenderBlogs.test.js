import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, waitFor } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import { blogs, creatorUser, nonCreatorUser, errorFromBackend } from './test_data'
import RenderBlogs from '../components/RenderBlogs'
import userService from '../services/user'
import blogService from '../services/blogs'
import NotificationContext from '../components/Notification'
import userEvent from '@testing-library/user-event'

describe('<RenderBlogs />', () => {
    const mocksetBlogs = jest.fn()
    userService.getUserId = jest.fn()
    const mockDispatch = jest.fn()
    NotificationContext.notificationConsumer = jest.fn()

    beforeEach(() => {
        NotificationContext.notificationConsumer.mockImplementation(() => ({ dispatch: mockDispatch }))
    })

    afterEach(() => cleanup())

    const renderDetails = () => {
        const { container, getByRole, getAllByRole, getByText, queryByRole } = render(
            <RenderBlogs user={creatorUser} blogs={blogs} setBlogs={mocksetBlogs} />
        )
        userEvent.click(getAllByRole('button', { name: 'Show' })[0])
        const details = container.querySelector('.details')
        return { container, getByRole, getByText, queryByRole, details }
    }

    describe('<Blog />', () => {
        test('Renders author, title and show button', () => {
            const { container, getByText, getAllByRole } = render(
                <RenderBlogs user={creatorUser} blogs={blogs} />)
            const renderBlogs = container.querySelector('#renderBlogs')
            expect(renderBlogs).toBeDefined()
            expect(renderBlogs).toContainElement(getByText(blogs[0].title))
            expect(renderBlogs).toContainElement(getByText(blogs[0].author))
            expect(renderBlogs).toContainElement(getAllByRole('button', { name: 'Show' })[0])
            expect(renderBlogs).not.toContainElement(renderBlogs.querySelector('.details'))
        })
    })

    describe('<Showdetails />', () => {
        test('Details are shown when show button is clicked', () => {
            const { getByText, getByRole, details } = renderDetails()
            expect(details).toBeDefined()
            expect(details).toContainElement(getByText(blogs[0].url))
            expect(details).toContainElement(getByText(blogs[0].user.name))
            const likes = getByText('Likes:', { exact: false })
            expect(likes).toHaveTextContent(`Likes: ${blogs[0].likes}`)
            expect(likes).toContainElement(getByRole('button', { name: 'Like' }))
        })
    })

    describe('<UpdateBlog />', () => {
        test('Likes are increased when like button is clicked', async () => {
            //mock for update (adding likes)
            blogService.update = jest.fn((id, blog) => ({ ...blog, user: creatorUser }))
            const { getByRole } = renderDetails()
            await waitFor(() => {
                userEvent.click(getByRole('button', { name: 'Like' }))
            })
            //updated blog which should be send to the backend
            const blogAfterLikedOnce = { ...blogs[0], likes: blogs[0].likes + 1, user: blogs[0].user.id }
            expect(blogService.update).toHaveBeenCalledTimes(1)
            expect(blogService.update).toHaveBeenLastCalledWith(blogs[0].id, blogAfterLikedOnce)
            //updated blog list after like is clicked
            const listAfterLikedOnce = [{ ...blogs[0], likes: blogs[0].likes + 1 }, blogs[1]]
            expect(mocksetBlogs).toHaveBeenCalledTimes(1)
            expect(mocksetBlogs).toHaveBeenLastCalledWith(listAfterLikedOnce)
            //Notification is called with correct arguments
            expect(mockDispatch).toHaveBeenCalledTimes(1)
            expect(mockDispatch).toHaveBeenLastCalledWith({
                type: 'notification',
                message: `Like added to blog: ${blogs[0].title} by ${blogs[0].author}`
            })
        })

        test('Adding likes fails if error with the backend', async () => {
            //mocks error from the backend
            blogService.update = jest.fn(() => { throw errorFromBackend })
            const { getByRole } = renderDetails()
            await waitFor(() => {
                userEvent.click(getByRole('button', { name: 'Like' }))
            })
            //does not try to call state update for blogs
            expect(mocksetBlogs).toHaveBeenCalledTimes(0)
            //error is catched accordingly, and notification is called with correct arguments
            expect(mockDispatch).toHaveBeenCalledTimes(1)
            expect(mockDispatch).toHaveBeenLastCalledWith({
                type: 'error',
                message: 'some error from backend'
            })
        })
    })

    describe('<DeleteBlog />', () => {
        test('Delete button is shown for blog if user is creator', () => {
            //no token from backend -> user id is manually set to creator
            userService.getUserId.mockImplementationOnce(() => creatorUser.id)
            const { getByRole, details } = renderDetails()
            expect(details).toContainElement(getByRole('button', { name: 'Delete' }))
        })

        test('Delete button is not shown for blog if user is not creator', () => {
            //no token from backend -> user id is manually set to non creator
            userService.getUserId.mockImplementationOnce(() => nonCreatorUser.id)
            const { queryByRole, details } = renderDetails()
            expect(details).not.toContainElement(queryByRole('button', { name: 'Delete' }))
        })

        test('Blog is not deleted if window confirm is cancelled', async () => {
            //no token from backend -> user id is manually set to creator
            userService.getUserId.mockImplementationOnce(() => creatorUser.id)
            window.confirm = jest.fn(() => false)    //auto click no to window.confirm
            blogService.remove = jest.fn()  //mock for remove
            const { container, getByRole, details } = renderDetails()
            await waitFor(() => {
                userEvent.click(getByRole('button', { name: 'Delete' }))
            })
            //does not call remove
            expect(blogService.remove).toHaveBeenCalledTimes(0)
            //rendering stays as is was before cancel
            expect(container.querySelector('#renderBlogs')).toContainElement(details)
        })

        test('Blog is deleted', async () => {
            //no token from backend -> user id is manually set to creator
            userService.getUserId.mockImplementationOnce(() => creatorUser.id)
            window.confirm = jest.fn(() => true)    //auto click yes to window.confirm
            blogService.remove = jest.fn()  //mock for remove
            const { getByRole } = renderDetails()
            await waitFor(() => {
                userEvent.click(getByRole('button', { name: 'Delete' }))
            })
            expect(blogService.remove).toHaveBeenCalledTimes(1)
            expect(blogService.remove).toHaveBeenLastCalledWith(blogs[0].id)
            //calls state update with updated blog list
            expect(mocksetBlogs).toHaveBeenCalledTimes(1)
            expect(mocksetBlogs).toHaveBeenLastCalledWith([blogs[1]])
            //Notification is called with correct arguments
            expect(mockDispatch).toHaveBeenCalledTimes(1)
            expect(mockDispatch).toHaveBeenLastCalledWith({
                type: 'notification',
                message: `User ${creatorUser.name} deleted blog ${blogs[0].title} by ${blogs[0].author}`
            })
        })

        test('Blog delete fails if error with the backend', async () => {
            //no token from backend -> user id is manually set to creator
            userService.getUserId.mockImplementationOnce(() => creatorUser.id)
            window.confirm = jest.fn(() => true)    //auto click yes to window.confirm
            //mocks error from the backend
            blogService.remove = jest.fn(() => { throw errorFromBackend })
            const { getByRole } = renderDetails()
            await waitFor(() => {
                userEvent.click(getByRole('button', { name: 'Delete' }))
            })
            //does not try to call state update for blogs
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

