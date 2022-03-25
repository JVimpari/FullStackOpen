const RenderNotification = ({message}) => {
    return(
        <div className='Notification'>
            <h3>{message}</h3>    
        </div>
    )
}

const RenderError = ({message}) => {
    return(
        <div className='Error'>
            {message.split(',').map(content => {
                return (<h3>{content}</h3>)
            })}
        </div>
    )
}

const Notification = ({notificationMessage, errorMessage}) => {
    
    return (
        <div>
            {notificationMessage ? <RenderNotification message={notificationMessage} /> : null}
            {errorMessage ? <RenderError message={errorMessage} /> : null}
        </div>
    )
}

export default Notification