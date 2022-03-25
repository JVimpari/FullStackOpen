import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {

    const addAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        props.createAnecdote(content)
        props.setNotification(`Created new: '${content}'`, 5)
    }

    return (
        <div id='create'>
            <h3>Create new</h3>&ensp;
            <form onSubmit={addAnecdote}>
                <input name='anecdote'/>
                <button type='submit'>create</button>
            </form>
        </div>
    )
}

AnecdoteForm.propTypes = {
    createAnecdote: PropTypes.func.isRequired,
    setNotification: PropTypes.func.isRequired
}

export default connect(
    null,
    { createAnecdote, setNotification }
)(AnecdoteForm)
