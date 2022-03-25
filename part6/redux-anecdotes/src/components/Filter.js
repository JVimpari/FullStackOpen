import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const Filter = (props) => {

    const handleFilterChange = (event) => {
        event.preventDefault()
        props.filterChange(event.target.value)
    }
    return (
        <div id='filter'>
            <h3>Filter</h3> &ensp;
            <input name='filter' onChange={handleFilterChange}/>
        </div>
    )
}

Filter.propTypes = {
    filterChange: PropTypes.func.isRequired
}

export default connect(
    null,
    { filterChange }
)(Filter)
