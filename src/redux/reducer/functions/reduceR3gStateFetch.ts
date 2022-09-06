import { R3gFetchReducer, R3gFetchReducerParams } from '../types'

// Reducer: Fetch
const reduceR3gStateFetch: R3gFetchReducer = <
  ResourceIdentifier,
  ResourceBody
>({
  state,
  payload,
}: R3gFetchReducerParams<ResourceIdentifier, ResourceBody>) => {
  // Deconstruct: Payload
  const { requestKey } = payload

  // Deconstruct: State
  const { pendingRequests: prevPendingRequests } = state

  // Derive: Find next request in queue
  const selectedRequest =
    prevPendingRequests.find(
      (pendingRequest) => pendingRequest.requestKey === requestKey
    ) ?? null

  // Fail Fast: Leave state unchanged if no request found
  const wasRequestFound = selectedRequest !== null
  if (!wasRequestFound) {
    return state
  }

  // Derive: Remove pending request from queue
  const nextPendingRequests = prevPendingRequests.filter(
    (pendingRequest) => pendingRequest.requestKey !== requestKey
  )

  // Deconstruct: Selected request
  const { hookKey, method } = selectedRequest

  // Construct: Request flags
  const requestFlags = {
    requestKey,
    hookKey,
    fetching: true,
    method,
    status: null,
    message: null,
    ...(method !== 'get' ? { resourceIdentifier: null } : {}),
  }

  // Return: Next state
  return {
    ...state,
    pendingRequests: nextPendingRequests,
    ...requestFlags,
  }
}

export default reduceR3gStateFetch
