import axios from 'axios'
const baseUrl = 'api/users'
import blogService from './blogs'

const getUserId = () => {
    return JSON.parse(atob(blogService.token.value.split('.')[1])).id
}

const deleteUser = async (id) => {
    await axios.delete(`${baseUrl}/${id}`, blogService.config)
}

const create = async (newUserObject) => {
    const response = await axios.post(baseUrl, newUserObject)
    return response.data
}

export default { create, deleteUser, getUserId }
