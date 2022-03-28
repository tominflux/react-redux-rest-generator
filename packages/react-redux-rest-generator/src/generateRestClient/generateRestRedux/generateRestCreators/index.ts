import { RestReduxActionSet } from '../generateRestActions/types'
import { RestReduxCreatorsGenerator } from './types'

const generateRestCreators: RestReduxCreatorsGenerator = (
  actions: RestReduxActionSet
) => ({
  setField: (name, value) => ({
    type: actions.SET_FIELD,
    payload: { name, value },
  }),
  queueRequest: (requestKey, hookKey, method, url, body) => ({
    type: actions.QUEUE_REQUEST,
    payload: { requestKey, hookKey, method, url, body },
  }),
  cancelRequest: (requestKey) => ({
    type: actions.CANCEL_REQUEST,
    payload: { requestKey },
  }),
  fetch: (requestKey) => ({
    type: actions.FETCH,
    payload: { requestKey },
  }),
  response: (requestKey, hookKey, method, status, message, apiPayload) => ({
    type: actions.RESPONSE,
    payload: {
      requestKey,
      hookKey,
      method,
      status,
      message,
      apiPayload,
    },
  }),
  resolve: (requestKey) => ({
    type: actions.RESOLVE,
    payload: { requestKey },
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
