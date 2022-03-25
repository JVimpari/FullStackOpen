import React, { useState, useEffect } from 'react'
import Form from './components/form'
import {filterList, Filter} from './components/filter'
import PrintEntries from './components/render'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const [persons, setPersons] = useState([])

  const [ newName, setNewName ] = useState('')

  const [ newNumber, setNewNumber ] = useState('')

  const [ newFilter, setNewFilter ] = useState('')

  const [ errorMessage, setErrorMessage ] = useState(null)
  
  const [ notificationMessage, setNotificationMessage ] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
    }
    const foundObject = persons.find( ({name}) => name === newName)
    if ( !foundObject ) {
      addName(nameObject)
    }
    else {
      const updatedObject = {...foundObject, number: newNumber}
      updateName(updatedObject)
    }
    setNewName('')
    setNewNumber('')
  }

  const addName = nameObject => {
    personService
      .addPerson(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        handleNotificationMessage(`Added information for '${nameObject.name}'`)
      })
      .catch(error => {
        handleErrorMessage(`Could not add information for '${nameObject.name}'!`)
      })
  }

  const updateName = (updatedObject) => {
    if (window.confirm(`${updatedObject.name} is already added to phonebook, replace the old number with new one?`)) {
      personService
        .updatePerson(updatedObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== updatedObject.id ? person : returnedPerson))
          handleNotificationMessage(`Updated information for '${updatedObject.name}'`)    
        })
        .catch(error => {
          handleErrorMessage(`Could not update information for '${updatedObject.name}'!`)
        })
    }
  }

  const deleteName = entry => {
    personService
      .deletePerson(entry.id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== entry.id))
      })
      .catch(error => { 
        handleErrorMessage(`Could not delete information for '${entry.name}'!`)
      })
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleErrorMessage = (message) => {
    setTimeout(() => setErrorMessage(null), 5000, setErrorMessage(message))
    personService
      .getAll()
      .then(returnedList => {
        setPersons(returnedList)
      })
  }

  const handleNotificationMessage = (message) => {
    setTimeout(() => setNotificationMessage(null), 5000, setNotificationMessage(message))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notificationMessage={notificationMessage} errorMessage={errorMessage} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <Form
        newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h3>Numbers</h3>
      <PrintEntries filteredEntries={filterList(persons, newFilter)} deleteName={deleteName} />
    </div>
  )
}


export default App