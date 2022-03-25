import React, { useState, useEffect } from 'react'
import RenderBlogs from './components/RenderBlogs'
import Login from './components/Login'
import Logout from './components/Logout'
import NotificationContext from './components/Notification'
import CreateBlog from './components/CreateBlog'
import CreateUser from './components/CreateUser'
import blogService from './services/blogs'

const App = () => {

    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)

    const NotificationProvider = NotificationContext.NotificationProvider
    const Notification = NotificationContext.Notification

    useEffect(() => {
        const fetchBlogs = async () => {
            const blogs = await blogService.getAll()
            setBlogs(blogs.sort((first, second) => second.likes - first.likes))
        }
        fetchBlogs()
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    return (
        <div>
            <NotificationProvider>
                <Notification />
                {!user
                    ?
                    <div>
                        <Login
                            setUser={setUser}
                        />
                        <CreateUser />
                    </div>
                    :
                    <div>
                        <h1>Blogs</h1>
                        <Logout
                            user={user}
                            setUser={setUser}
                            blogs={blogs}
                            setBlogs={setBlogs}
                        />
                        <CreateBlog
                            blogs={blogs}
                            setBlogs={setBlogs}
                        />
                        <RenderBlogs
                            user={user}
                            blogs={blogs}
                            setBlogs={setBlogs}
                        />
                    </div>
                }
            </NotificationProvider>
        </div>
    )
}

export default App