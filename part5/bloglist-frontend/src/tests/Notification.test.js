import React from 'react'
import PropTypes from 'prop-types'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, waitFor } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import NotificationContext from '../components/Notification'
import userEvent from '@testing-library/user-event'

describe('NotificationContext', () => {

    const NotificationProvider = NotificationContext.NotificationProvider
    const Notification = NotificationContext.Notification

    //Test function to call new messages
    const TestMessages = ({ type, message }) => {
        const { dispatch } = NotificationContext.notificationConsumer()
        return (
            <button onClick={() => dispatch({ type: type, message: message })}>Test</button>
        )
    }
    TestMessages.propTypes = {
        type: PropTypes.string,
        message: PropTypes.string
    }

    const renderMessages = (type, message) => {
        const { container, getByRole, getByText, queryByText } = render(
            <NotificationProvider>
                <Notification />
                <TestMessages type={type} message={message}/>
            </NotificationProvider>
        )
        return { container, getByRole, getByText, queryByText }
    }

    afterEach(() => cleanup())

    test('Notification message is rendered', async () => {
        const { container, getByRole, getByText } = renderMessages('notification', 'some notification')
        await waitFor(() => {
            userEvent.click(getByRole('button', { name: 'Test' }))
        })
        const messages = container.querySelector('#messages')
        expect(container).toContainElement(messages)
        const notification = messages.querySelector('.notification')
        expect(messages).toContainElement(notification)
        expect(notification).toContainElement(getByText('some notification'))
    })

    test ('Error message is rendered', async () => {
        const { container, getByRole, getByText } = renderMessages('error', 'some error')
        await waitFor(() => {
            userEvent.click(getByRole('button', { name: 'Test' }))
        })
        const messages = container.querySelector('#messages')
        expect(container).toContainElement(messages)
        const error = messages.querySelector('.error')
        expect(messages).toContainElement(error)
        expect(error).toContainElement(getByText('some error'))
    })

    test('Message is automatically removed after few seconds', async () => {
        //speeding up the test
        jest.useFakeTimers()
        const { container, getByRole, queryByText } = renderMessages('notification', 'some notification')
        await waitFor(() => {
            userEvent.click(getByRole('button', { name: 'Test' }))
        })
        //notification is completely removed from the dom
        await waitFor(() => {
            expect(container).not.toContainElement(container.querySelector('#messages'))
            expect(container).not.toContainElement(container.querySelector('.notification'))
            expect(container).not.toContainElement(queryByText('some notification'))
        }, { timeout: 5500 })
    })

    test('Logs error if dispatch is called with wrong action.type', async () => {
        console.error = jest.fn()
        const { getByRole } = renderMessages('invalidType')
        await waitFor(() => {
            userEvent.click(getByRole('button', { name: 'Test' }))
        })
        expect(console.error).toHaveBeenLastCalledWith('Invalid action type: invalidType')
    })
})