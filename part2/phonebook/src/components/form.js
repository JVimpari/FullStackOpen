const FormInput = ( {forminput, handleFunction} ) => {
    return (
        <input value={forminput} onChange={handleFunction} required />
    )
}

const Form = ( {newName, handleNameChange, newNumber, handleNumberChange, handleSubmit} ) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>name: </label>
                <FormInput forminput={newName} handleFunction={handleNameChange} />
            </div>
            <div>
                <label>number: </label>
                <FormInput forminput={newNumber} handleFunction={handleNumberChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default Form

 