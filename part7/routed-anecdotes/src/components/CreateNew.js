import React from 'react'
import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'
import { useNavigate } from 'react-router-dom'
import { notificationConsumer } from './Notification'
import { useField } from '../hooks'

const FormInput = (props) => {
    const { labelText, ...inputObject } = props
    return (
        <>
            <label htmlFor={inputObject.type}>
                {labelText}
            </label>
            <input {...inputObject} />
        </>
    )
}

FormInput.propTypes = {
    labelText: PropTypes.string.isRequired
}

const CreateNew = ({ anecdotes, setAnecdotes }) => {
    const content = useField('content')
    const author = useField('author')
    const info = useField('info')
    const navigate = useNavigate()
    const { dispatch } = notificationConsumer()

    const handleSubmit = (e) => {
        e.preventDefault()
        const newAnecdote = ({
            content: content.value,
            author: author.value,
            info: info.value,
            votes: 0,
            id: nanoid()
        })

        setAnecdotes(anecdotes.concat(newAnecdote))
        navigate('/')
        dispatch({
            type: 'notification',
            message: `A new anecdote: '${newAnecdote.content}' created!`
        })
    }

    const handleReset = (e) => {
        e.preventDefault()
        content.onReset()
        author.onReset()
        info.onReset()
    }

    return (
        <div>
            <h2>Create a new anecdote</h2>
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <FormInput labelText='content' { ...content } />
                <FormInput labelText='author' { ...author } />
                <FormInput labelText='url for more info' { ...info } />
                <button type='submit'>create</button>
                <button type='reset'>reset</button>
            </form>
        </div>
    )
}

CreateNew.propTypes = {
    anecdotes: PropTypes.arrayOf(PropTypes.object).isRequired,
    setAnecdotes: PropTypes.func.isRequired,
}

export default CreateNew