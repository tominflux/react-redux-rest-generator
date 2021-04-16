import { combineReducers } from 'redux'
import { exampleReducer } from 'restClients/example'

const rootReducer = combineReducers({
    exampleState: exampleReducer
})

export default rootReducer
