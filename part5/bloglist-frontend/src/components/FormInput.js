import React from 'react'
import PropTypes from 'prop-types'

const FormInput = ({ name, type, register, errors }) => {
    const commonName = name.replace('new', '')
    var pattern
    if (name === 'newUsername') {
        pattern = {
            value: /^[a-zA-Z\d-_]{3,30}$/,
            message: 'Must have 3-30 characters, alphanumeric, - and _ are allowed'
        }
    }
    if (name === 'newPassword') {
        pattern = {
            value: /^\S{3,30}$/,
            message: 'Must have 3-30 characters, whitespaces are not allowed'
        }
    }

    return (
        <>
            <label htmlFor={name}>
                {commonName}:
            </label>
            <input
                id={name}
                type={type ? type : 'text'}
                {...register(
                    name, {
                        required: `${commonName} is required`,
                        pattern
                    }
                )}
            />
            {(errors?.[name]) && <span className='formError'>&#x26A0;{errors[name].message}</span>}
        </>
    )
}

FormInput.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object
}

export default FormInput