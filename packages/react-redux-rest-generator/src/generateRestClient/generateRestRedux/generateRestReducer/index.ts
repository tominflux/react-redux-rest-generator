import { RestApiPayload, RestMethod, RestPrimitive } from '../../../types'
import isStatusOk from '../../../utils/isStatusOk'
import reduceResourceList from '../../../utils/reduceResourceList'
import { RestResourceConfig } from '../../types'
import { RestReduxInitialStateGetter } from '../generateInitialStateGetter/types'
import { RestReduxActionSet } from '../generateRestActions/types'
import {
  RestReadPayload,
  RestReduxState,
  RestRequest,
  RestResult,
} from '../types'
import { RestReducer, RestReducerGenerator } from './types'

const generateRestReducer: RestReducerGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  getInitialState: RestReduxInitialStateGetter<
    CompositeIdentifierType,
    AnonResourceType
  >,
  actions: RestReduxActionSet,
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => {
  const reducer: RestReducer<CompositeIdentifierType, AnonResourceType> = (
    state = getInitialState(),
    action
  ) => {
    switch (action.type) {
      case actions.SET_FIELD: {
        const { name, value } = action.payload

        const mergingObject = {
          [name as keyof AnonResourceType]: value as RestPrimitive,
        } as Record<keyof AnonResourceType, RestPrimitive>

        const fields = {
          ...state.fields,
          ...mergingObject,
        }

        const nextState = {
          ...state,
          fields,
        }

        return nextState
      }
      case actions.QUEUE_REQUEST: {
        const { requestKey, hookKey, method, url, body } = action.payload
        const request: RestRequest = {
          requestKey: requestKey as string,
          hookKey: hookKey as string,
          method: method as RestMethod,
          url: url as string,
          body: body as string,
        }
        const pendingRequests = [...state.pendingRequests, request]
        const nextState: RestReduxState<
          CompositeIdentifierType,
          AnonResourceType
        > = {
          ...state,
          pendingRequests,
        }
        return nextState
      }
      case actions.CANCEL_REQUEST: {
        const { key } = action.payload
        const index = state.pendingRequests.findIndex(
          (request) => request.requestKey === key
        )
        if (index === -1) return state
        const pendingRequests = [
          ...state.pendingRequests.slice(0, index),
          ...state.pendingRequests.slice(index + 1),
        ]
        const nextState = {
          ...state,
          key: null,
          fetching: false,
          status: null,
          method: null,
          message: null,
          pendingRequests,
        }
        return nextState
      }
      case actions.FETCH: {
        const { requestKey } = action.payload
        // Ensure not already fetching
        if (state.fetching) {
          throw new Error(
            `R3G - ${resourceConfig.name} - Attempted to fetch whilst already fetching.`
          )
        }
        // Ensure existing request key is null
        if (state.requestKey !== null) {
          throw new Error(
            `R3G - ${resourceConfig.name} - Attempted to fetch but a request key already exists.`
          )
        }
        // Ensure a pending request exists
        if (state.pendingRequests.length === 0) {
          throw new Error(
            `R3G - ${resourceConfig.name} - Pending request queue is empty.`
          )
        }
        // Find next request in queue
        const currentRequest =
          state.pendingRequests.find(
            (pendingRequest) => pendingRequest.requestKey === requestKey
          ) ?? null
        // Ensure request exists
        if (currentRequest === null) {
          throw new Error(
            `R3G - ${resourceConfig.name} - Queued request with key '${requestKey}' does not exist.`
          )
        }
        // Remove pending request from queue
        const pendingRequests = state.pendingRequests.filter(
          (pendingRequest) => pendingRequest.requestKey !== requestKey
        )
        // Extract data from request
        const { hookKey, method } = currentRequest
        // Set current request flags
        const requestFlags = {
          requestKey: requestKey as string,
          hookKey,
          fetching: true,
          method,
          status: null,
          message: null,
          ...(method !== 'get' ? { compositeIdentifier: null } : {}),
        }
        const nextState: RestReduxState<
          CompositeIdentifierType,
          AnonResourceType
        > = {
          ...state,
          pendingRequests,
          ...requestFlags,
        }
        return nextState
      }
      case actions.RESPONSE: {
        const {
          requestKey,
          hookKey,
          method,
          status,
          message,
          apiPayload,
        } = action.payload
        // Ensure response key matches current request key
        if (requestKey !== state.requestKey) {
          console.error('R3G response key mismatch', {
            responseKey: requestKey,
            requestKey: state.requestKey,
          })
          throw new Error(
            `R3G - ${resourceConfig.name} - Request key mismatch. New request was likely made whilst waiting for response.`
          )
        }
        // Handle read responses
        if (state.method === 'get') {
          // Handle error scenario
          if (!isStatusOk(status as number)) {
            // Construct operation result
            const nextResult: RestResult<
              CompositeIdentifierType,
              AnonResourceType
            > = {
              requestKey: requestKey as string,
              hookKey: hookKey as string,
              method: method as RestMethod,
              status: status as number,
              message: message as string,
              payload: apiPayload as null,
            }

            // Concatenate operation result list
            const nextReceivedResults = [...state.receivedResults, nextResult]

            // Construct next redux state
            const nextState: RestReduxState<
              CompositeIdentifierType,
              AnonResourceType
            > = {
              ...state,
              receivedResults: nextReceivedResults,
              fetching: false,
              requestKey: null,
              hookKey: null,
              status: status as number,
              message: message as string,
            }

            // Return next redux state
            return nextState
          }

          // Ensure payload is delivered
          if ((apiPayload ?? null) === null) {
            console.error('REST Resource Config', resourceConfig)
            console.error('REST Reducer State', state)
            console.error('REST Action Payload', action.payload)
            throw new Error(
              `R3G - ${resourceConfig.name} - No resource list returned, response payload is nullish.`
            )
          }

          // Deconstruct response payload
          const { resourceList } = apiPayload as RestReadPayload<
            CompositeIdentifierType,
            AnonResourceType
          >

          // Ensure resourceLst is delivered
          if ((resourceList ?? null) === null) {
            console.error('REST Resource Config', resourceConfig)
            console.error('REST Reducer State', state)
            console.error('REST Action Payload', action.payload)
            throw new Error(
              `R3G - ${resourceConfig.name} - No resource list returned, resource list is nullish.`
            )
          }

          // Contextualize resource list
          const newResourceList = resourceList

          // Reduce resource list (update cache)
          const nextResourceList = reduceResourceList(
            state.resourceList as Array<Record<string, unknown>>,
            newResourceList as Array<Record<string, unknown>>,
            resourceConfig.identifiers
          ) as Array<CompositeIdentifierType & AnonResourceType>

          // Construct operation result
          const nextResult: RestResult<
            CompositeIdentifierType,
            AnonResourceType
          > = {
            requestKey: requestKey as string,
            hookKey: hookKey as string,
            method: method as RestMethod,
            status: status as number,
            message: message as string,
            payload: apiPayload as RestReadPayload<
              CompositeIdentifierType,
              AnonResourceType
            >,
          }

          // Concatenate received result list
          const nextReceivedResults = [...state.receivedResults, nextResult]

          // Construct next redux state
          const nextState: RestReduxState<
            CompositeIdentifierType,
            AnonResourceType
          > = {
            ...state,
            resourceList: nextResourceList,
            receivedResults: nextReceivedResults,
            fetching: false,
            requestKey: null,
            hookKey: null,
            status: status as number,
            message: message as string,
          }

          // Return next redux state
          return nextState
        }
        // Handle create responses
        if (state.method === 'post') {
          if ((apiPayload ?? null) === null) {
            console.error('REST Resource Config', resourceConfig)
            console.error('REST Reducer State', state)
            throw new Error(
              `R3G - ${resourceConfig.name} - No composite identifier returned, response payload is null.`
            )
          }
          const nextResult: RestResult<
            CompositeIdentifierType,
            AnonResourceType
          > = {
            requestKey: requestKey as string,
            hookKey: hookKey as string,
            method: method as RestMethod,
            status: status as number,
            message: message as string,
            payload: apiPayload as CompositeIdentifierType,
          }
          const nextReceivedResults = [...state.receivedResults, nextResult]
          const { compositeIdentifier } = apiPayload as RestApiPayload<
            CompositeIdentifierType,
            AnonResourceType
          >
          const nextState: RestReduxState<
            CompositeIdentifierType,
            AnonResourceType
          > = {
            ...state,
            receivedResults: nextReceivedResults,
            fetching: false,
            requestKey: null,
            hookKey: null,
            status: status as number,
            message: message as string,
            compositeIdentifier: compositeIdentifier ?? null,
          }
          return nextState
        }
        // Handle update/delete responses
        const nextResult: RestResult<
          CompositeIdentifierType,
          AnonResourceType
        > = {
          requestKey: requestKey as string,
          hookKey: hookKey as string,
          method: method as RestMethod,
          status: status as number,
          message: message as string,
          payload: apiPayload as null,
        }
        const nextReceivedResults = [...state.receivedResults, nextResult]
        const nextState: RestReduxState<
          CompositeIdentifierType,
          AnonResourceType
        > = {
          ...state,
          receivedResults: nextReceivedResults,
          fetching: false,
          requestKey: null,
          hookKey: null,
          status: status as number,
          message: message as string,
        }
        return nextState
      }
      case actions.RESOLVE: {
        const { requestKey } = action.payload
        const receivedResults = state.receivedResults.filter(
          (receivedResult) => receivedResult.requestKey !== requestKey
        )
        return {
          ...state,
          receivedResults,
        }
      }
      case actions.INVALIDATE: {
        return {
          ...state,
          resourceList: [],
          invalidationIndex: state.invalidationIndex + 1,
        }
      }
      case actions.CLEAR_FIELDS: {
        return {
          ...state,
          fields: resourceConfig.initialFields,
        }
      }
      case actions.CLEAR_RESPONSE: {
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
      default:
        return state
    }
  }

  return reducer
}

export default generateRestReducer
