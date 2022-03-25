const DelButton = ( {entry, deleteName} ) => {
  return (
    <button onClick={() => {
      if (window.confirm(`Delete ${entry.name}?`)) {
          deleteName(entry)
      }}}>
      delete
    </button>
  )
}

const Number = ( {number} ) => {
  return (
    <div>
      {number}
    </div>
  )
}

const Name = ( {name} ) => {
  return (
    <div>
      {name}
    </div>
  )
}

const Entry = ( {entry, deleteName} ) => {
  return (
    <li>
      <Name name={entry.name} />
      <Number number={entry.number} />
      <DelButton entry={entry} deleteName={deleteName}/>
    </li>
  )
}

const PrintEntries = ( {filteredEntries, deleteName} ) => {
    return(
      <div>
        <ul className='person'>
          {filteredEntries.map(entry => 
            <Entry key={entry.id} entry={entry} deleteName={deleteName}/>
          )}
        </ul>   
      </div>
    )
  }
export default PrintEntries