import React, { useState } from 'react'
import PropTypes from 'prop-types'
import UpdateBlog from './UpdateBlog'
import DeleteBlog from './DeleteBlog'

const ShowDetails = (props) => {
    const { blog, ...others } = props
    return (
        <ul className='details'>
            <li>{blog.url}</li>
            <UpdateBlog blog={blog} {...others} />
            <li>{blog.user.name}</li>
            <DeleteBlog blog={blog} {...others} />
        </ul>
    )
}

ShowDetails.propTypes = {
    blog: PropTypes.shape({
        url: PropTypes.string.isRequired,
        likes: PropTypes.number.isRequired,
        user: PropTypes.shape({
            name: PropTypes.string.isRequired
        })
    }).isRequired,
}

const Blog = (props) => {
    const { blog, ...others } = props
    const [showDetails, setShowDetails] = useState(false)

    return (
        <li>
            <b className='blogTitle'>{blog.title}</b>
            <b className='blogAuthor'>{blog.author}</b>
            <button className='blogDetailsButton' onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'Hide' : 'Show'}</button>
            {showDetails && <ShowDetails blog={blog} {...others} />}
        </li>
    )
}

Blog.propTypes = {
    blog: PropTypes.shape({
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired
    }).isRequired,
}

const RenderBlogs = (props) => {
    const { blogs, ...others } = props
    return (
        <div>
            <ul id='renderBlogs'>
                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog} blogs={blogs} {...others} />
                )}
            </ul>
        </div>
    )
}

RenderBlogs.propTypes = {
    blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default RenderBlogs