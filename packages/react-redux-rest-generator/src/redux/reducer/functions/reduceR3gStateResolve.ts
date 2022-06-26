import { R3gResolveReducer, R3gResolveReducerParams } from '../types'

// Reducer: Resolve
const reduceR3gStateResolve: R3gResolveReducer = <
  ResourceIdentifier,
  ResourceBody
>({
  state,
  payload,
}: R3gResolveReducerParams<ResourceIdentifier, ResourceBody>) => {
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
