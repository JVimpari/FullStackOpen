import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Notification = (props) => {

    return (
        <div>
            <ul id='notificationContainer'>
                {props.notifications.map(notification =>
                    <li key={notification.id} className='notification'>
                        {notification.content}
                        {(notification.count > 1) && `  (${notification.count})`}
                    </li>
                )}
            </ul>
        </div>
    )
}

Notification.propTypes = {
    notifications: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
    return {
        notifications: state.notifications
    }
}

export default connect(mapStateToProps)(Notification)