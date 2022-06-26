import {
  R3gCancelRequestReducer,
  R3gCancelRequestReducerParams,
} from '../types'

// Reducer: Cancel Request
const reduceR3gStateCancelRequest: R3gCancelRequestReducer = <
  ResourceIdentifier,
  ResourceBody
>({
  state,
  payload,
}: R3gCancelRequestReducerParams<ResourceIdentifier, ResourceBody>) => {
  // Deconstruct: Action payload
  const { requestKey } = payload

  // Deconstruct: Pending requests from state
  const { pendingRequests: prevPendingRequests } = state

  // Derive: Index of request
  const requestIndex = prevPendingRequests.findIndex(
    (request) => request.requestKey === requestKey
  )

  // Fail Fast: Leave state unchanged if no matched request found
  const wasRequestFound = requestIndex !== -1
  if (!wasRequestFound) return state

  // Concatenate: Pending request list without matched request
  const nextPendingRequests = [
    ...prevPendingRequests.slice(0, requestIndex),
    ...prevPendingRequests.slice(requestIndex + 1),
  ]

  return {
    ...state,
    pendingRequests: nextPendingRequests,
  }
}

export default reduceR3gStateCancelRequest
