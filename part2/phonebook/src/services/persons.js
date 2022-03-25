import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const addPerson = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const deletePerson = objectId => {
    const request = axios.delete(`${baseUrl}/${objectId}`)
    return request.then(response => response)
}

const updatePerson = updatedObject => {
    const request = axios.put(`${baseUrl}/${updatedObject.id}`, updatedObject)
    return request.then(response => response.data)
}

const personService = {getAll, addPerson, deletePerson, updatePerson}

export default personService