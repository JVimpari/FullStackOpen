import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        appendAnecdote(state, action) {
            state.push(action.payload)
        },
        addVote(state, action) {
            return (
                state.map(anecdote =>
                    anecdote.id !== action.payload.id
                        ? anecdote
                        : action.payload
                )
            )
        },
        setAnecdotes(state, action) {
            return action.payload
        },
        sortAnecdotes(state) {
            return (
                state.sort((a, b) => b.votes - a.votes)
            )
        }
    }
})

export const { appendAnecdote, addVote, setAnecdotes, sortAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
    return async (dispatch) => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const createAnecdote = (content) => {
    return async (dispatch) => {
        const newAnecdote = await anecdoteService.createNew(content)
        dispatch(appendAnecdote(newAnecdote))
    }
}

export const voteAnecdote = (anecdote) => {
    return async (dispatch) => {
        const updatedAnecdote = await anecdoteService.addVote(anecdote)
        dispatch(addVote(updatedAnecdote))
    }
}

export default anecdoteSlice.reducer