import {
  R3gClearResponseReducer,
  R3gClearResponseReducerParams,
} from '../types'

// Reducer: Clear fields
const reduceR3gStateClearResponse: R3gClearResponseReducer = <
  CompositeIdentifierType,
  AnonResourceType
>({
  state,
  payload,
}: R3gClearResponseReducerParams<
  CompositeIdentifierType,
  AnonResourceType
>) => {
  // Deconstruct: Payload
  const {} = payload

  // Construct: Next state
  return {
    ...state,
    fetching: false,
    requestKey: null,
    hookKey: null,
    method: null,
    status: null,
    message: null,
    compositeIdentifier: null,
  }
}

export default reduceR3gStateClearResponse
