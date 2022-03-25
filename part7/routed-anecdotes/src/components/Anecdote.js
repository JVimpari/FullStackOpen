import React from 'react'
import PropTypes from 'prop-types'

const Anecdote = ({ anecdote }) => {
    return (
        <div>
            <h3>{anecdote.content} by {anecdote.author}</h3>
            has {anecdote.votes} votes <br/>
            for more info see {anecdote.info}
        </div>
    )
}

Anecdote.propTypes = {
    anecdote: PropTypes.shape({
        content: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        votes: PropTypes.number.isRequired,
        info: PropTypes.string.isRequired
    })

}

export default Anecdote