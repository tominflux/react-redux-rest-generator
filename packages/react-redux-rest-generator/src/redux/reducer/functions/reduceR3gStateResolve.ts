import { R3gResolveReducer, R3gResolveReducerParams } from '../types'

// Reducer: Resolve
const reduceR3gStateResolve: R3gResolveReducer = <
  CompositeIdentifierType,
  AnonResourceType
>({
  state,
  payload,
}: R3gResolveReducerParams<CompositeIdentifierType, AnonResourceType>) => {
  // Deconstruct: Payload
  const { requestKey } = payload

  // Deconstruct: State
  const { receivedResults: prevReceivedResults } = state

  // Derive: Next received results
  const nextReceivedResults = prevReceivedResults.filter(
    (receivedResult) => receivedResult.requestKey !== requestKey
  )

  // Construct: Next state
  return {
    ...state,
    receivedResults: nextReceivedResults,
  }
}

export default reduceR3gStateResolve
