import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const onSubmit = () => {
        setValue('')
    }

    return {
        type,
        value,
        onChange,
        onSubmit
    }
}

const useResource = (baseUrl) => {
    const [resources, setResources] = useState([])

    useEffect(() => {
        const getResource = async () => {
            const response = await axios.get(baseUrl)
            setResources(response.data)
        }
        getResource()
    }, [])

    const create = async (resource) => {
        const response = await axios.post(baseUrl, resource)
        setResources(resources.concat(response.data))
    }

    const service = {
        create
    }

    return [
        resources, service
    ]
}

const App = () => {
    const content = useField('text')
    const name = useField('text')
    const number = useField('text')

    const [notes, noteService] = useResource('http://localhost:3005/notes')
    const [persons, personService] = useResource('http://localhost:3005/persons')

    const handleNoteSubmit = (event) => {
        event.preventDefault()
        noteService.create({ content: content.value })
        content.onSubmit()
    }

    const handlePersonSubmit = (event) => {
        event.preventDefault()
        personService.create({ name: name.value, number: number.value })
        name.onSubmit()
        number.onSubmit()
    }

    return (
        <div>
            <h2>notes</h2>
            <form onSubmit={handleNoteSubmit}>
                <input {...content} />
                <button type='submit'>create</button>
            </form>
            {notes.map(n => <p key={n.id}>{n.content}</p>)}

            <h2>persons</h2>
            <form onSubmit={handlePersonSubmit}>
                name <input {...name} /> <br/>
                number <input {...number} />
                <button type='submit'>create</button>
            </form>
            {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
        </div>
    )
}

export default App