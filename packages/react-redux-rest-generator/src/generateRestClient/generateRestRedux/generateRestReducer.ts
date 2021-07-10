import reduceResourceList from '../../utils/reduceResourceList'

const getInitialState: (
  initialFields: Record<string, unknown>
) => RestReduxState = (initialFields) => ({
  fields: initialFields,
  resourceList: [],
  pendingRequests: [],
  fetching: false,
  method: null,
  status: null,
  message: null,
  invalidationIndex: 0,
  compositeIdentifier: null,
})

const generateRestReducer: (
  actions: RestReduxActionSet,
  resourceConfig: RestResourceConfig
) => RestReducer = (actions, resourceConfig) => (
  state = getInitialState(resourceConfig.initialFields),
  action
) => {
  switch (action.type) {
    case actions.SET_FIELD: {
      const { name, value } = action.payload
      const fields = {
        ...state.fields,
        [name as string]: value,
      }
      const nextState: RestReduxState = {
        ...state,
        fields,
      }
      return nextState
    }
    case actions.QUEUE_REQUEST: {
      const { key, method, url, body } = action.payload
      const request: RestRequest = {
        key: key as string,
        method: method as string,
        url: url as string,
        body: body as string,
      }
      const pendingRequests = [...state.pendingRequests, request]
      const nextState: RestReduxState = {
        ...state,
        pendingRequests,
      }
      return nextState
    }
    case actions.FETCH: {
      // Ensure a pending request exists
      if (state.pendingRequests.length === 0) {
        throw new Error(
          `${resourceConfig.name} - Pending request queue is empty.`
        )
      }
      // Remove pending request from queue
      const currentRequest = state.pendingRequests.slice(0, 1)[0]
      const pendingRequests = state.pendingRequests.slice(1)
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
      const nextState: RestReduxState = {
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
        const { resourceList } = apiPayload as R3GApiPayload
        const newResourceList = resourceList ?? []
        const nextResourceList = reduceResourceList(
          state.resourceList,
          newResourceList,
          resourceConfig.identifiers
        )
        const nextState: RestReduxState = {
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
        const { compositeIdentifier } = apiPayload as R3GApiPayload
        const nextState: RestReduxState = {
          ...state,
          fetching: false,
          status: status as number,
          message: message as string,
          compositeIdentifier: compositeIdentifier ?? null,
        }
        return nextState
      }
      // Handle update/delete responses
      const nextState: RestReduxState = {
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

export default generateRestReducer
