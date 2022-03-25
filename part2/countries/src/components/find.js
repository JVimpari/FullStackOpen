const InputField = ( {newFilter, handleFilterChange} ) => {
    return (
        <input value={newFilter} onChange={handleFilterChange} />
    )
}

const FindCountries = ( {newFilter, handleFilterChange} ) => {
    return (
        <div>
            <label>find countries: </label>
            <InputField newFilter={newFilter} handleFilterChange={handleFilterChange} />
        </div>
    )
  }

export default FindCountries