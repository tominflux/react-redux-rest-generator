import { R3gInvalidateReducer, R3gInvalidateReducerParams } from '../types'

// Reducer: Invalidate
const reduceR3gStateInvalidate: R3gInvalidateReducer = <
  ResourceIdentifier,
  ResourceBody
>({
  state,
  payload,
}: R3gInvalidateReducerParams<ResourceIdentifier, ResourceBody>) => {
  // Deconstruct: Payload
  const {} = payload

  // Deconstruct: State
  const { invalidationIndex: prevInvalidationIndex } = state

  // Derive: Next invalidation index
  const nextInvalidationIndex = prevInvalidationIndex + 1

  // Construct: Next state
  return {
    ...state,
    resourceList: [],
    invalidationIndex: nextInvalidationIndex,
  }
}

export default reduceR3gStateInvalidate
