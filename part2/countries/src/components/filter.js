const filterCountries = (newFilter, countries) => {
    
    const normalizeString = (inputString) => {
        return (
            inputString.toLocaleLowerCase().normalize('NFKD').replace(/\p{Diacritic}/gu, "")
        )
    }
    return (
        countries.filter(country => normalizeString(country.name.common).includes(normalizeString(newFilter)))
    )
}

const Filter = (newFilter, countries) => {
    const filteredCountries = filterCountries(newFilter, countries)
    const numberOfCountries = Object.keys(filteredCountries).length
    return {
        countries: filteredCountries,
        number: numberOfCountries
    }
}

export default Filter