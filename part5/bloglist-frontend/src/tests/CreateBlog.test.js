import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, waitFor } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import { blogs, newBlog, creatorUser, errorFromBackend } from './test_data'
import blogService from '../services/blogs'
import CreateBlog from '../components/CreateBlog'
import NotificationContext from '../components/Notification'
import userEvent from '@testing-library/user-event'

describe('<CreateBlog />', () => {
    //mock functions
    const mocksetBlogs = jest.fn()
    const mockDispatch = jest.fn()
    NotificationContext.notificationConsumer = jest.fn()

    beforeEach(() => {
        NotificationContext.notificationConsumer.mockImplementation(() => ({ dispatch: mockDispatch }))
    })

    afterEach(() => cleanup())

    const renderCreateBlog = () => {
        const { container, getByRole, getByLabelText, getByText } = render(
            <CreateBlog blogs={blogs} setBlogs={mocksetBlogs} />
        )
        const createBlogForm = container.querySelector('#createBlogForm')
        return { container, getByRole, getByLabelText, getByText, createBlogForm }
    }

    test('<ToggleVisible /> does not show new blog form by default', () => {
        const { container, getByRole, createBlogForm } = renderCreateBlog()
        expect(createBlogForm).not.toContainElement(container.querySelector('form'))
        expect(createBlogForm).toContainElement(getByRole('button', { name: 'Create new blog' }))
    })

    test('<ToggleVisible /> shows new blog form when button is clicked', () => {
        const { container, getByRole, createBlogForm } = renderCreateBlog()
        userEvent.click(getByRole('button', { name: 'Create new blog' }))
        expect(createBlogForm).toContainElement(container.querySelector('form'))
        expect(createBlogForm).toContainElement(getByRole('button', { name: 'Cancel' }))
    })

    test('<ToggleVisible /> hides new blog form when cancel button is clicked', () => {
        const { container, getByRole, createBlogForm } = renderCreateBlog()
        userEvent.click(getByRole('button', { name: 'Create new blog' }))
        userEvent.click(getByRole('button', { name: 'Cancel' }))
        expect(createBlogForm).not.toContainElement(container.querySelector('form'))
    })

    test('Submitting valid new blog', async () => {
        //no connection to backend-> user is manually added for handleNotification
        blogService.create = jest.fn(blog => ({ ...blog, user: creatorUser }))
        const { container, getByRole, getByLabelText, createBlogForm } = renderCreateBlog()
        userEvent.click(getByRole('button', { name: 'Create new blog' }))
        userEvent.type(getByLabelText('Title:'), newBlog.title)
        userEvent.type(getByLabelText('Author:'), newBlog.author)
        userEvent.type(getByLabelText('Url:'), newBlog.url)
        await waitFor(() => {
            userEvent.click(getByRole('button', { name: 'Create blog' }))
        })
        expect(blogService.create).toHaveBeenCalledTimes(1)
        expect(blogService.create).toHaveBeenLastCalledWith(newBlog)
        //Closes form automatically when new blog is created
        expect(createBlogForm).not.toContainElement(container.querySelector('form'))
        //calls state update with updated list of blogs
        expect(mocksetBlogs).toHaveBeenCalledTimes(1)
        expect(mocksetBlogs).toHaveBeenLastCalledWith(blogs.concat({ ...newBlog, user: creatorUser }))
        //Notification is called with correct arguments
        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(mockDispatch).toHaveBeenLastCalledWith({
            type: 'notification',
            message: `User ${creatorUser.name} added a new blog: ${newBlog.title} by ${newBlog.author}`
        })
    })

    test('Shows error messages if blog validation fails', async () => {
        blogService.create = jest.fn() //mock for create
        const { getByRole, getByText, createBlogForm } = renderCreateBlog()
        userEvent.click(getByRole('button', { name: 'Create new blog' }))
        await waitFor(() => {
            userEvent.click(getByRole('button', { name: 'Create blog' }))
        })
        expect(createBlogForm).toContainElement(getByText(/Title is required/))
        expect(createBlogForm).toContainElement(getByText(/Author is required/))
        expect(createBlogForm).toContainElement(getByText(/Url is required/))
        //Does not call backend if empty input
        expect(blogService.create).toHaveBeenCalledTimes(0)
    })

    test('Submitting fails for valid new blog if error with the backend', async () => {
        //mock error from backend
        blogService.create = jest.fn(() => { throw errorFromBackend } )
        const { getByRole, getByLabelText } = renderCreateBlog()
        userEvent.click(getByRole('button', { name: 'Create new blog' }))
        userEvent.type(getByLabelText('Title:'), newBlog.title)
        userEvent.type(getByLabelText('Author:'), newBlog.author)
        userEvent.type(getByLabelText('Url:'), newBlog.url)
        await waitFor(() => {
            userEvent.click(getByRole('button', { name: 'Create blog' }))
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