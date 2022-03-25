import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote, sortAnecdotes } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, dispatch }) => {
    const handleVote = (anecdote) => {
        dispatch(voteAnecdote(anecdote))
        dispatch(setNotification(`Voted: '${anecdote.content}'`, 5))
    }
    return (
        <li className='Anecdote'>
            {anecdote.content}<br />
            votes: &ensp; {anecdote.votes} &ensp;
            <button onClick={() => handleVote(anecdote)}>vote</button>
        </li>
    )
}

Anecdote.propTypes = {
    anecdote: PropTypes.shape({
        content: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        votes: PropTypes.number.isRequired
    }),
    dispatch: PropTypes.func.isRequired
}

const AnecdoteList = () => {
    const dispatch = useDispatch()

    const anecdotes = useSelector(({ anecdotes, filter }) => {
        return (
            anecdotes.filter(anecdote =>
                anecdote.content.toLowerCase().includes(
                    filter.toLowerCase()
                )
            )
        )
    })
    dispatch(sortAnecdotes())

    return (
        <ul id='AnecdoteList'>
            {anecdotes.map(anecdote =>
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    dispatch={dispatch}
                />
            )}
        </ul>
    )
}

export default AnecdoteList