import { R3gRequestMethod, R3gRequestResult } from '../../request/types'

/*********************************/
/*********  Primitives  **********/
/*********************************/

// Primitives: R3G Action Key Suffixes
export type R3gSetFieldActionKeySuffix = 'SET_FIELD'
export type R3gQueueRequestActionKeySuffix = 'QUEUE_REQUEST'
export type R3gCancelRequestActionKeySuffix = 'CANCEL_REQUEST'
export type R3gFetchActionKeySuffix = 'FETCH'
export type R3gResponseActionKeySuffix = 'RESPONSE'
export type R3gResolveActionKeySuffix = 'RESOLVE'
export type R3gInvalidateActionKeySuffix = 'INVALIDATE'
export type R3gClearFieldsActionKeySuffix = 'CLEAR_FIELDS'
export type R3gClearResponseActionKeySuffix = 'CLEAR_RESPONSE'

// Primitive: R3G Action Key Suffix
export type R3gActionKeySuffix =
  | R3gSetFieldActionKeySuffix
  | R3gQueueRequestActionKeySuffix
  | R3gCancelRequestActionKeySuffix
  | R3gFetchActionKeySuffix
  | R3gResponseActionKeySuffix
  | R3gResolveActionKeySuffix
  | R3gInvalidateActionKeySuffix
  | R3gClearFieldsActionKeySuffix
  | R3gClearResponseActionKeySuffix

// Primitive: R3G Action Key
export type R3gActionKey = `R3G_${R3gActionKeySuffix}_${string}`

// Primitives: R3G Action Keys
export type R3gSetFieldActionKey = `R3G_SET_FIELD_${string}`
export type R3gQueueRequestActionKey = `R3G_QUEUE_REQUEST_${string}`
export type R3gCancelRequestActionKey = `R3G_CANCEL_REQUEST_${string}`
export type R3gFetchActionKey = `R3G_FETCH_${string}`
export type R3gResponseActionKey = `R3G_RESPONSE_${string}`
export type R3gResolveActionKey = `R3G_RESOLVE_${string}`
export type R3gInvalidateActionKey = `R3G_INVALIDATE_${string}`
export type R3gClearFieldsActionKey = `R3G_CLEAR_FIELDS_${string}`
export type R3gClearResponseActionKey = `R3G_CLEAR_RESPONSE_${string}`

// Primitives: R3G 'Action Key' Record Keys
export type R3gSetFieldActionKeyRecordKey = 'setField'
export type R3gQueueRequestActionKeyRecordKey = 'queueRequest'
export type R3gCancelRequestActionKeyRecordKey = 'cancelRequest'
export type R3gFetchActionKeyRecordKey = 'fetch'
export type R3gResponseActionKeyRecordKey = 'response'
export type R3gResolveActionKeyRecordKey = 'resolve'
export type R3gInvalidateActionKeyRecordKey = 'invalidate'
export type R3gClearFieldsActionKeyRecordKey = 'clearFields'
export type R3gClearResponseActionKeyRecordKey = 'clearResponse'

// Primitive: R3G 'Action Key' Record Key
export type R3gActionKeyRecordKey =
  | R3gSetFieldActionKeyRecordKey
  | R3gQueueRequestActionKeyRecordKey
  | R3gCancelRequestActionKeyRecordKey
  | R3gFetchActionKeyRecordKey
  | R3gResponseActionKeyRecordKey
  | R3gResolveActionKeyRecordKey
  | R3gInvalidateActionKeyRecordKey
  | R3gClearFieldsActionKeyRecordKey
  | R3gClearResponseActionKeyRecordKey

/*********************************/
/*******  Data Structures  *******/
/*********************************/

// List: R3G 'Action Key' Record Key List
export type R3gActionKeyRecordKeyList = Array<R3gActionKeyRecordKey>

// Record: R3G Action Key Record
export type R3gActionKeyRecord = {
  setField: R3gSetFieldActionKey
  queueRequest: R3gQueueRequestActionKey
  cancelRequest: R3gCancelRequestActionKey
  fetch: R3gFetchActionKey
  response: R3gResponseActionKey
  resolve: R3gResolveActionKey
  invalidate: R3gInvalidateActionKey
  clearFields: R3gClearFieldsActionKey
  clearResponse: R3gClearResponseActionKey
}

/*********************************/
/********  Redux Actions  ********/
/*********************************/

// Action: R3G Set Field
export type R3gSetFieldActionPayload<AnonResourceType> = {
  name: keyof AnonResourceType
  value: unknown
}
export type R3gSetFieldAction<AnonResourceType> = {
  type: R3gSetFieldActionKey
  payload: R3gSetFieldActionPayload<AnonResourceType>
}

// Action: R3G Queue Request
export type R3gQueueRequestActionPayload = {
  requestKey: string
  hookKey: string
  method: R3gRequestMethod
  url: string
  body: string | null
}
export type R3gQueueRequestAction = {
  type: R3gQueueRequestActionKey
  payload: R3gQueueRequestActionPayload
}

// Action: R3G Cancel Request
export type R3gCancelRequestActionPayload = {
  requestKey: string
}
export type R3gCancelRequestAction = {
  type: R3gCancelRequestActionKey
  payload: R3gCancelRequestActionPayload
}

// Action: R3G Fetch
export type R3gFetchActionPayload = {
  requestKey: string
}
export type R3gFetchAction = {
  type: R3gFetchActionKey
  payload: R3gFetchActionPayload
}

// Action: R3G Resolve
export type R3gResolveActionPayload = {
  requestKey: string
}
export type R3gResolveAction = {
  type: R3gResolveActionKey
  payload: R3gResolveActionPayload
}

// Action: R3G Response
export type R3gResponseActionPayload<
  CompositeIdentifierType,
  AnonResourceType
> = {
  requestResult: R3gRequestResult<CompositeIdentifierType, AnonResourceType>
}
export type R3gResponseAction<CompositeIdentifierType, AnonResourceType> = {
  type: R3gResponseActionKey
  payload: R3gResponseActionPayload<CompositeIdentifierType, AnonResourceType>
}

// Action: R3G Invalidate
export type R3gInvalidateActionPayload = Record<string, never>
export type R3gInvalidateAction = {
  type: R3gInvalidateActionKey
  payload: R3gInvalidateActionPayload
}

// Action: R3G Clear Fields
export type R3gClearFieldsActionPayload = Record<string, never>
export type R3gClearFieldsAction = {
  type: R3gClearFieldsActionKey
  payload: R3gClearFieldsActionPayload
}

// Action: R3G Clear Response
export type R3gClearResponseActionPayload = Record<string, never>
export type R3gClearResponseAction = {
  type: R3gClearResponseActionKey
  payload: R3gClearResponseActionPayload
}

// Action: R3G Ambiguous Action
export type R3gAction<CompositeIdentifierType, AnonResourceType> =
  | R3gSetFieldAction<AnonResourceType>
  | R3gQueueRequestAction
  | R3gCancelRequestAction
  | R3gFetchAction
  | R3gResolveAction
  | R3gResponseAction<CompositeIdentifierType, AnonResourceType>
  | R3gInvalidateAction
  | R3gClearFieldsAction
  | R3gClearResponseAction

/*********************************/
/*********  Functions  ***********/
/*********************************/

// Function: Get generic R3G action key record
export type GetGenericR3gActionKeyRecordFunctionParams = {
  resourceName: string
}
export type GetGenericR3gActionKeyRecord = (
  params: GetGenericR3gActionKeyRecordFunctionParams
) => R3gActionKeyRecord
