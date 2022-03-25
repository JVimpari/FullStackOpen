import axios from 'axios'
const baseUrl = '/api/blogs'

var token = { value: null }

var config = {
    headers: { Authorization: null }
}

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const setToken = (newToken) => {
    token.value = `Bearer ${newToken}`
    config.headers.Authorization = token.value
}

const create = async (newBlogObject) => {
    const response = await axios.post(baseUrl, newBlogObject, config)
    return response.data
}

const update = async (id, updatedBlogObject) => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedBlogObject)
    return response.data
}

const remove = async (id) => {
    await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, setToken, create, update, token, remove, config }