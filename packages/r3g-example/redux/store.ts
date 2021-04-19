import { useState } from 'react'
import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducer'

const useStore = (stateOverrides = {}) => {
    const getInitialStore = (initialState) =>
        createStore(rootReducer, initialState, composeWithDevTools())

    const initialState = {
        ...stateOverrides
    }

    const [store] = useState(getInitialStore(initialState))

    return store
}

export default useStore
