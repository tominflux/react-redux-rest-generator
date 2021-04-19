const generateRestCreators: (
  actions: RestReduxActionSet
) => RestReduxCreatorSet = (actions) => ({
  setField: (name, value) => ({
    type: actions.SET_FIELD,
    payload: { name, value },
  }),
  fetch: (method) => ({
    type: actions.FETCH,
    payload: { method },
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
