import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const ToggleVisible = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(ref, () => {
        return {
            toggleVisibility
        }
    })

    return (
        <>
            {!visible
                ?
                <button className='toggleVisible' onClick={toggleVisibility}>{props.buttonLabel}</button>
                :
                <>
                    {props.children}
                    <button className='toggleHidden' onClick={toggleVisibility}>Cancel</button>
                </>
            }
        </>
    )
})

ToggleVisible.displayName = 'ToggleVisible'

ToggleVisible.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired
}

export default ToggleVisible