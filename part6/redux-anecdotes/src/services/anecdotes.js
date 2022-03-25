import axios from 'axios'
import { nanoid } from '@reduxjs/toolkit'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const createNew = async (content) => {
    const newAnecdoteObject = {
        content: content,
        id: nanoid(),
        votes: 0
    }
    const response = await axios.post(baseUrl, newAnecdoteObject)
    return response.data
}

const addVote = async (anecdoteObject) => {
    const updatedObject = {
        ...anecdoteObject,
        votes: anecdoteObject.votes + 1
    }
    const response = await axios.put(`${baseUrl}/${updatedObject.id}`, updatedObject)
    return response.data
}

export default { getAll, createNew, addVote }