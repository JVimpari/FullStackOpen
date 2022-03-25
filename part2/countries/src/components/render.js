import { useState } from "react"
import Weather from "./weather"

const Languages = ( {entry} ) => {
    return (
        <div>
            <h4>Spoken languages</h4>
            <ul className='Languages'>
                {Object.values(entry.languages).map(language => 
                    <li key={language}>
                        {language}
                    </li>
                )}
                </ul>
        </div>
    )
}

const Flag = ( {entry} ) => {
    return (
        <div>
            <img src={entry.flags.svg} alt='Failed to load flag'/>
        </div>
    )
}

const Population = ( {entry} ) => {
    return (
        <div>
            <b>population: </b> {entry.population}
        </div>
    )
}

const Capital = ( {entry} ) => {
    return (
        <div>
            <b>capital: </b> {entry.capital}
        </div>
    )
}

const ShowDetailed = ( {entry, onlyOne} ) => {
    return (
        <div className='Details'>
            {(onlyOne) ? <h2>{entry.name.common}</h2> : null}
            <Capital entry={entry} />
            <Population entry={entry} />
            <Flag entry={entry} />
            <Languages entry={entry} />
            <Weather city={entry.capital} />
        </div> 
    )
}

const ShowButton = ( {handleShow, show} ) => {
    return (
        <button onClick={handleShow}>{(show) ? 'hide' : 'show'}</button>
    )
}

const Entry = ( {entry} ) => {
    const [ show, setShow ] = useState(false)
    const handleShow = () => {
        setShow(!show)
    }
    return (
        <div>
            <li>
                {(show) ? <h2>{entry.name.common}</h2> : <p>{entry.name.common}</p>}
                <ShowButton handleShow={handleShow} show={show}/>
            </li>
            {(show) ? <ShowDetailed entry={entry} onlyOne={false} /> : null}
        </div>
        
    )
}

const PrintEntries = ( {newFilter, filtered} ) => {
    const filteredCountries = filtered.countries
    const numberOfCountries = filtered.number
    return (
        <div>
            {!numberOfCountries
            ? `No countries found with search:'${newFilter}'.`
            : numberOfCountries > 10
            ? `Too many matches, specify more detailed filter.`
            : numberOfCountries === 1
            ? <ShowDetailed entry={filteredCountries[0]} onlyOne={true}/>
            :
            <ul className='Countries'>
                {filteredCountries.map(entry =>
                    <Entry key={entry.name.common} entry={entry} />
                )}
            </ul>    
            } 
        </div>
    )
}

export default PrintEntries