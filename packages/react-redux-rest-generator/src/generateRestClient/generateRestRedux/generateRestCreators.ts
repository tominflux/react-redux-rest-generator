import { RestReduxCreatorsGenerator, RestReduxActionSet } from '../../types'

const generateRestCreators: RestReduxCreatorsGenerator = (
  actions: RestReduxActionSet
) => ({
  setField: (name, value) => ({
    type: actions.SET_FIELD,
    payload: { name, value },
  }),
  queueRequest: (key, method, url, body) => ({
    type: actions.QUEUE_REQUEST,
    payload: { key, method, url, body },
  }),
  cancelRequest: (key) => ({
    type: actions.CANCEL_REQUEST,
    payload: { key },
  }),
  fetch: (requestKey) => ({
    type: actions.FETCH,
    payload: { requestKey },
  }),
  response: (key, status, message, apiPayload) => ({
    type: actions.RESPONSE,
    payload: {
      key,
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
