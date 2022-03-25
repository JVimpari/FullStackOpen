import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const App = () => {

    const storeDispatch = (type) => {
        store.dispatch({
            type: type
        })
    }

    return (
        <div>
            <button onClick={() => storeDispatch('GOOD')}>good</button>
            <button onClick={() => storeDispatch('OK')}>ok</button>
            <button onClick={() => storeDispatch('BAD')}>bad</button>
            <button onClick={() => storeDispatch('ZERO')}>reset stats</button>
            <div>good {store.getState().good}</div>
            <div>ok {store.getState().ok}</div>
            <div>bad {store.getState().bad}</div>
        </div>
    )
}

const renderApp = () => {
    ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)