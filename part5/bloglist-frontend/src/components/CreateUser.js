import React, { useRef } from 'react'
import userService from '../services/user'
import ToggleVisible from './ToggleVisible'
import FormInput from './FormInput'
import { useForm } from 'react-hook-form'
import NotificationContext from './Notification'

const CreateUser = () => {

    const CreateUserRef = useRef()

    const { dispatch } = NotificationContext.notificationConsumer()

    const { register, handleSubmit, formState: { errors } } = useForm()

    const handleUserCreate = async (data) => {
        try {
            const createdUser = await userService.create({
                username: data.newUsername,
                name: data.newName,
                password: data.newPassword
            })
            CreateUserRef.current.toggleVisibility()
            dispatch({
                type: 'notification',
                message: `User: ${createdUser.username} created for ${createdUser.name}`
            })
        } catch (error) {
            dispatch({
                type: 'error',
                message: error.response.data.error
            })
        }
    }

    return (
        <div id='createUserForm'>
            <ToggleVisible buttonLabel='Create new user' ref={CreateUserRef}>
                <form onSubmit={handleSubmit(handleUserCreate)}>
                    <FormInput name='newUsername' register={register} errors={errors} />
                    <FormInput name='newName' register={register} errors={errors} />
                    <FormInput name='newPassword' type='password' register={register} errors={errors} />
                    <button id='createUserButton' type='submit'>Create user</button>
                </form>
            </ToggleVisible>
        </div>
    )
}

export default CreateUser