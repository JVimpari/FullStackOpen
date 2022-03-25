import React, { createContext, useContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import { v4 as uuidv4 } from 'uuid'

const RenderNotification = ({ message }) => {
    return (
        <li className={message.type}>
            <h3>{message.message}</h3>
        </li>
    )
}

RenderNotification.propTypes = {
    message: PropTypes.shape({
        type: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired
    })
}

const NotificationContext = createContext()
NotificationContext.displayName = 'messageContext'


const NotificationProvider = ({ children }) => {

    const reducer = (state, action) => {

        if (action.type === 'notification' || action.type === 'error') {
            const messageId = uuidv4()

            const newMessage = {
                type: action.type,
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
        } else {
            console.error(`Invalid action type: ${action.type}`)
            return {
                messages: { ...state.messages }
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
            <ul id='messages'>
                {state.messages.map(message =>
                    <RenderNotification key={message.id} message={message} />
                )}
            </ul>
        )
    }
    return null
}

export default {  NotificationProvider, Notification, notificationConsumer }
