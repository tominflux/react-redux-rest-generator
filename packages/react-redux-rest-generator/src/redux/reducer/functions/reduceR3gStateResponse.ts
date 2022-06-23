import reduceResourceList from '../../../utils/reduceResourceList'
import { R3gResponseReducer, R3gResponseReducerParams } from '../types'

// Reducer: Response
const reduceR3gStateResponse: R3gResponseReducer = <
  ResourceIdentifier,
  ResourceBody
>({
  state,
  payload,
  resourceIdentifiers,
  resourceListName,
}: R3gResponseReducerParams<ResourceIdentifier, ResourceBody>) => {
  // Deconstruct: Payload
  const { requestResult } = payload

  // Deconstruct: State
  const {
    receivedResults: prevReceivedResults,
    resourceList: prevResourceList,
  } = state

  // Deconstruct: Request result
  const {
    status,
    success,
    message,
    method,
    payload: requestResultPayload,
  } = requestResult

  // Construct: Request flags
  const requestFlags = {
    fetching: false,
    requestKey: null,
    hookKey: null,
    status,
    message,
  }

  // Concatenate: Next received result list
  const nextReceivedResults = [...prevReceivedResults, requestResult]

  // Switch: Request method
  switch (method) {
    // Case: GET method
    case 'get': {
      // Fail Fast: Erroneous result
      if (success === false) {
        // Construct: Next redux state
        return {
          ...state,
          ...requestFlags,
          receivedResults: nextReceivedResults,
        }
      }

      // Deconstruct: Request payload
      const newResourceList = requestResultPayload[resourceListName]

      // Derive: Next resource list
      const nextResourceList = reduceResourceList(
        prevResourceList as Array<Record<string, unknown>>,
        newResourceList as Array<Record<string, unknown>>,
        resourceIdentifiers as Array<string>
      ) as Array<ResourceIdentifier & ResourceBody>

      // Construct: Next redux state
      return {
        ...state,
        ...requestFlags,
        resourceList: nextResourceList,
        receivedResults: nextReceivedResults,
      }
    }
    // Case: POST method
    case 'post': {
      // Fail Fast: Erroneous result
      if (success === false) {
        // Construct: Next redux state
        return {
          ...state,
          ...requestFlags,
          receivedResults: nextReceivedResults,
        }
      }

      // Reconstruct: Request payload
      const { ...resourceIdentifier } = requestResultPayload

      // Construct: Next redux state
      return {
        ...state,
        ...requestFlags,
        resourceIdentifier,
        receivedResults: nextReceivedResults,
      }
    }
    // Case: PUT method & DELETE method
    case 'put':
    case 'delete': {
      // Construct: Next redux state
      return {
        ...state,
        ...requestFlags,
      }
    }
  }
}

export default reduceR3gStateResponse
