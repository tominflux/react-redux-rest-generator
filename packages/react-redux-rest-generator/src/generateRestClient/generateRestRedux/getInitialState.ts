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

export default getInitialState
