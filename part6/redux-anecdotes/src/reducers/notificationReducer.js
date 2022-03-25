import { createSlice, nanoid } from '@reduxjs/toolkit'

export const setNotification = (content, time) => {

    const clearNotification = (dispatch, time, id) => {
        return (
            setTimeout(() => {
                dispatch(removeNotification(id))
            }, (time * 1000))
        )
    }

    return async (dispatch, getState) => {
        const exists = getState().notifications.find(notification =>
            notification.content === content
        )
        if (exists) {
            clearTimeout(exists.timer)
            const timer = clearNotification(dispatch, time, exists.id)
            dispatch(updateNotification({ ...exists, timer, count: exists.count + 1 }))
        } else {
            const id = nanoid()
            const timer = clearNotification(dispatch, time, id)
            dispatch(addNotification({ content, id, timer, count: 1 }))
        }
    }
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState: [],
    reducers: {
        addNotification(state, action) {
            state.push(action.payload)
        },
        updateNotification(state, action) {
            return (
                state.map(notification =>
                    notification.id !== action.payload.id
                        ? notification
                        : action.payload
                )
            )
        },
        removeNotification(state, action) {
            return (
                state.filter(notification =>
                    notification.id !== action.payload
                )
            )
        }
    }
})

const { addNotification, removeNotification, updateNotification } = notificationSlice.actions
export default notificationSlice.reducer