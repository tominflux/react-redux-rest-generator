const generateRestCreators: (
  actions: RestReduxActionSet
) => RestReduxCreatorSet = (actions) => ({
  setField: (name, value) => ({
    type: actions.SET_FIELD,
    payload: { name, value },
  }),
  queueRequest: (method, body) => ({
    type: actions.QUEUE_REQUEST,
    payload: { method, body },
  }),
  fetch: () => ({
    type: actions.FETCH,
    payload: {},
  }),
  response: (status, message, apiPayload) => ({
    type: actions.RESPONSE,
    payload: {
      status,
      message,
      apiPayload,
    },
  }),
  invalidate: () => ({
    type: actions.INVALIDATE,
    payload: {},
  }),
  clearFields: () => ({
    type: actions.CLEAR_FIELDS,
    payload: {},
  }),
  clearResponse: () => ({
    type: actions.CLEAR_RESPONSE,
    payload: {},
  }),
})

export default generateRestCreators
