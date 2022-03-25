const RenderNotification = ({message}) => {
    return(
        <div className='Notification'>
            <h2>{message}</h2>    
        </div>
    )
}

const RenderError = ({message}) => {
    return(
        <div className='Error'>
            <h2>{message}</h2>    
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