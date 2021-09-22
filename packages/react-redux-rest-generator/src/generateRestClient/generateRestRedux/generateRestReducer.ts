import reduceResourceList from '../../utils/reduceResourceList'

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
  resourceConfig: RestResourceConfig<AnonResourceType, ReadParamsType>
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
        const { key, method, url, body } = action.payload
        const request: RestRequest = {
          key: key as string,
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
          (request) => request.key === key
        )
        if (index === -1) return state
        const pendingRequests = [
          ...state.pendingRequests.slice(0, index),
          ...state.pendingRequests.slice(index + 1),
        ]
        const nextState = {
          ...state,
          pendingRequests,
        }
        return nextState
      }
      case actions.FETCH: {
        const { requestKey } = action.payload
        // Ensure a pending request exists
        if (state.pendingRequests.length === 0) {
          throw new Error(
            `${resourceConfig.name} - Pending request queue is empty.`
          )
        }
        // Find next request in queue
        const currentRequest =
          state.pendingRequests.find(
            (pendingRequest) => pendingRequest.key === requestKey
          ) ?? null
        // Ensure request exists
        if (currentRequest === null) {
          throw new Error(
            `${resourceConfig.name} - Queued request with key '${requestKey}' does not exist.`
          )
        }
        // Remove pending request from queue
        const pendingRequests = state.pendingRequests.filter(
          (pendingRequest) => pendingRequest.key !== requestKey
        )
        // Extract data from request
        const { method } = currentRequest
        // Set current request flags
        const requestFlags = {
          fetching: true,
          method: method as RestMethod,
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
        const { status, message, apiPayload } = action.payload
        // Handle read responses
        if (state.method === 'get') {
          if ((apiPayload ?? null) === null) {
            console.error('REST Resource Config', resourceConfig)
            console.error('REST Reducer State', state)
            throw new Error(
              'No resource list returned - response payload is null.'
            )
          }
          const { resourceList } = apiPayload as RestApiPayload<
            CompositeIdentifierType,
            AnonResourceType
          >
          const newResourceList = resourceList ?? []
          const nextResourceList = reduceResourceList(
            state.resourceList as Array<Record<string, unknown>>,
            newResourceList as Array<Record<string, unknown>>,
            resourceConfig.identifiers
          ) as Array<AnonResourceType>
          const nextState: RestReduxState<
            CompositeIdentifierType,
            AnonResourceType
          > = {
            ...state,
            resourceList: nextResourceList,
            fetching: false,
            status: status as number,
            message: message as string,
          }
          return nextState
        }
        // Handle create responses
        if (state.method === 'post') {
          if ((apiPayload ?? null) === null) {
            console.error('REST Resource Config', resourceConfig)
            console.error('REST Reducer State', state)
            throw new Error(
              'No composite identifier returned - response payload is null.'
            )
          }
          const { compositeIdentifier } = apiPayload as RestApiPayload<
            CompositeIdentifierType,
            AnonResourceType
          >
          const nextState: RestReduxState<
            CompositeIdentifierType,
            AnonResourceType
          > = {
            ...state,
            fetching: false,
            status: status as number,
            message: message as string,
            compositeIdentifier: compositeIdentifier ?? null,
          }
          return nextState
        }
        // Handle update/delete responses
        const nextState: RestReduxState<
          CompositeIdentifierType,
          AnonResourceType
        > = {
          ...state,
          fetching: false,
          status: status as number,
          message: message as string,
        }
        return nextState
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
