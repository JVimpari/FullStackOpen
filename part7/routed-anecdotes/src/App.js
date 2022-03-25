import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import {
    Routes,
    Route,
    useMatch
} from 'react-router-dom'

import About from './components/About'
import Footer from './components/Footer'
import Menu from './components/Menu'
import AnecdoteList from './components/AnecdoteList'
import CreateNew from './components/CreateNew'
import Anecdote from './components/Anecdote'
import { NotificationProvider, Notification } from './components/Notification'

const App = () => {
    const [anecdotes, setAnecdotes] = useState([
        {
            content: 'If it hurts, do it more often',
            author: 'Jez Humble',
            info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
            votes: 0,
            id: nanoid()
        },
        {
            content: 'Premature optimization is the root of all evil',
            author: 'Donald Knuth',
            info: 'http://wiki.c2.com/?PrematureOptimization',
            votes: 0,
            id: nanoid()
        }
    ])

    const match = useMatch('/anecdotes/:id')

    const anecdoteById = match
        ? anecdotes.find(a => a.id === match.params.id)
        : null
    /*
    const anecdoteById = (id) =>
        anecdotes.find(a => a.id === id)

    const vote = (id) => {
        const anecdote = anecdoteById(id)

        const voted = {
            ...anecdote,
            votes: anecdote.votes + 1
        }

        setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
    }*/

    return (
        <div>
            <NotificationProvider>
                <Notification />
                <h1>Software anecdotes</h1>
                <Menu />
                <Routes>
                    <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/create' element={<CreateNew anecdotes={anecdotes} setAnecdotes={setAnecdotes} />} />
                    <Route path='/anecdotes/:id' element={<Anecdote anecdote={anecdoteById} />} />
                </Routes>
                <Footer />
            </NotificationProvider>
        </div>
    )
}

export default App
