import { R3gRequest } from '../../../request/types'
import { R3gQueueRequestReducer, R3gQueueRequestReducerParams } from '../types'

// Reducer: Queue Request
const reduceR3gStateQueueRequest: R3gQueueRequestReducer = <
  CompositeIdentifierType,
  AnonResourceType
>({
  state,
  payload,
}: R3gQueueRequestReducerParams<CompositeIdentifierType, AnonResourceType>) => {
  // Deconstruct: Queue Request action payload
  const { requestKey, hookKey, method, url, body } = payload

  // Deconstruct: Pending request list from state
  const { pendingRequests: prevPendingRequests } = state

  // Construct: New request
  const newRequest: R3gRequest = {
    requestKey,
    hookKey,
    method,
    url,
    body,
  }

  // Concatenate: New pending request list
  const nextPendingRequests = [...prevPendingRequests, newRequest]

  return {
    ...state,
    pendingRequests: nextPendingRequests,
  }
}

export default reduceR3gStateQueueRequest
