import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
    const initialState = {
        good: 0,
        ok: 0,
        bad: 0
    }

    var state

    beforeEach(() => {
        state = initialState
        deepFreeze(state)
    })

    const setupState = (type) => {
        const action = {
            type: type
        }
        const newState = counterReducer(state, action)
        const expectedState = {
            good: type === 'GOOD' ? 1 : 0,
            ok: type === 'OK' ? 1 : 0,
            bad: type === 'BAD' ? 1 : 0
        }
        return { newState, expectedState }
    }

    test('should return a proper initial state when called with undefined state', () => {
        const action = {
            type: 'DO_NOTHING'
        }

        const newState = counterReducer(undefined, action)
        expect(newState).toEqual(initialState)
    })

    test('good is incremented', () => {
        const { newState, expectedState } = setupState('GOOD')
        expect(newState).toEqual(expectedState)
    })

    test('ok is incremented', () => {
        const { newState, expectedState } = setupState('OK')
        expect(newState).toEqual(expectedState)
    })

    test('bad is incremented', () => {
        const { newState, expectedState } = setupState('BAD')
        expect(newState).toEqual(expectedState)
    })

    test('Every counter is reset to zero', () => {
        const { newState, expectedState } = setupState('ZERO')
        expect(newState).toEqual(expectedState)
    })
})