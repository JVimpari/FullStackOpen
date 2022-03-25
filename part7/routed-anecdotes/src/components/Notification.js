import React, { createContext, useContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'

const NotificationContext = createContext()
NotificationContext.displayName = 'messageContext'

const NotificationProvider = ({ children }) => {
    const reducer = (state, action) => {
        if (action.type === 'notification') {
            const messageId = nanoid()
            const newMessage = {
                message: action.message,
                id: messageId
            }
            setTimeout(() => dispatch({ type: 'flush', id: newMessage.id }), 5000)
            return {
                messages: state.messages.concat(newMessage)
            }
        } else if (action.type === 'flush') {
            return {
                messages: state.messages.filter(message => message.id !== action.id)
            }
        }
    }
    const initialState = { messages: [] }
    const [ state, dispatch ] = useReducer(reducer, initialState)
    return (
        <NotificationContext.Provider value={[ state, dispatch ]}>
            {children}
        </NotificationContext.Provider>
    )
}

NotificationProvider.propTypes = ({
    children: PropTypes.arrayOf(PropTypes.element).isRequired
})

const notificationConsumer = () => {
    const [ state, dispatch ] = useContext(NotificationContext)
    return { state, dispatch }
}

const Notification = () => {
    const { state } = notificationConsumer()
    if (state.messages.length) {
        return (
            <div>
                <ul id='notificationContainer'>
                    {state.messages.map(message =>
                        <li key={message.id} className='notification'>
                            {message.message}
                        </li>
                    )}
                </ul>
            </div>
        )
    }
    return null
}

export {  NotificationProvider, Notification, notificationConsumer }