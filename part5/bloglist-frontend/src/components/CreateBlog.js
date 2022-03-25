import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'
import ToggleVisible from './ToggleVisible'
import FormInput from './FormInput'
import { useForm } from 'react-hook-form'
import NotificationContext from './Notification'

const CreateBlog = ({ blogs, setBlogs }) => {

    const CreateBlogRef = useRef()

    const { dispatch } = NotificationContext.notificationConsumer()

    const { register, handleSubmit, formState: { errors } } = useForm()

    const handleCreate = async (data) => {
        try {
            const createdBlog = await blogService.create({
                title: data.Title,
                author: data.Author,
                url: data.Url
            })
            setBlogs(blogs.concat(createdBlog))
            CreateBlogRef.current.toggleVisibility()
            dispatch({
                type: 'notification',
                message: `User ${createdBlog.user.name} added a new blog: ${createdBlog.title} by ${createdBlog.author}`
            })
        } catch (error){
            dispatch({
                type: 'error',
                message: error.response.data.error
            })
        }
    }

    return (
        <div id='createBlogForm'>
            <ToggleVisible buttonLabel='Create new blog' ref={CreateBlogRef}>
                <form onSubmit={handleSubmit(handleCreate)}>
                    <FormInput name='Title' register={register} errors={errors} />
                    <FormInput name='Author' register={register} errors={errors} />
                    <FormInput name='Url' register={register} errors={errors} />
                    <button id='createBlogButton' type='submit'>Create blog</button>
                </form>
            </ToggleVisible>
        </div>
    )
}

CreateBlog.propTypes = {
    blogs: PropTypes.arrayOf(PropTypes.object),
    setBlogs: PropTypes.func.isRequired
}

export default CreateBlog