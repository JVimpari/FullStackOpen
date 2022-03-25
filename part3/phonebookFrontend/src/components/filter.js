const filterList = (persons, newFilter) => {
    const normalizeString = (inputString) => {
        return (
            inputString.toLocaleLowerCase().normalize('NFKD').replace(/\p{Diacritic}/gu, "")
        )
    }
    return (
        persons.filter( ({name}) => normalizeString(name).includes(normalizeString(newFilter)))
    )
}

const FilterInput = ( {filter, handleFunction} ) => {
    return (
        <input value={filter} onChange={handleFunction}/>
    )
}

const Filter = ( {newFilter, handleFilterChange} ) => {
    return (
        <div>
            <label>filter shown with: </label>
            <FilterInput filter={newFilter} handleFunction={handleFilterChange} />
        </div>
    )
}
export {filterList, Filter}