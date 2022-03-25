import React, { useState, useEffect } from 'react'
import axios from 'axios'
import FindCountries from './components/find'
import PrintEntries from './components/render'
import Filter from './components/filter'

const App= () => {

  const [ newFilter, setNewFilter ] = useState('')
  const [ countries, setCountries ] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <FindCountries newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <PrintEntries newFilter={newFilter} filtered={Filter(newFilter, countries)} />
    </div>
  )
}

export default App;
