const ExtraInfo = ( {info} ) => {
    const extraName = 
    <div>
        <b>Accepted name format:</b>
        <ul className='extralist'>
            <li>Must contain 3-30 characters</li>
                <ul className='extralist'>
                    <li>Small and (or) capital</li>
                    <li>Latin alphabet</li>
                    <li>Accents</li>
                    <li>Diacritical marks</li>
                </ul>
            <li>Can be multipart- or fullname<br />
                separated with:
            </li>
                <ul className='extralist'>
                    <li>hyphens '-'</li>
                    <li>spaces ' '</li>
                </ul>
        </ul>
    </div>
    const extraNumber = 
        <div>
        <b>Accepted phonenumber format:</b>
        <ul className='extralist'>
        <li>Must contain 8-15 digits</li>
        <li>May start with '+' sign</li>
        <li>Numbers can be separated with</li>
            <ul className='extralist'>
                <li>hyphens '-'</li>
                <li>spaces ' '</li>
            </ul>
        </ul>
    </div>
    
    return (
        <span className='extra'>
            {(info === 'name') ? extraName : extraNumber}
        </span>
    )
}

const InfoIcon = () => {
    return (
        <input type='image' className='info' src='info-circle-solid.svg' alt='info button'/>
    )
}

const FormInput = ( {forminput, handleFunction} ) => {
    return (
        <input type='text'value={forminput} onChange={handleFunction} required />
    )
}

const Form = ( {newName, handleNameChange, newNumber, handleNumberChange, handleSubmit} ) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>name: </label>
                <FormInput forminput={newName} handleFunction={handleNameChange} />
                <InfoIcon />
                <ExtraInfo info='name'/>
            </div>
            <div>
                <label>number: </label>
                <FormInput forminput={newNumber} handleFunction={handleNumberChange} />
                <InfoIcon />
                <ExtraInfo info='number'/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default Form

 