import { RestResourceConfig } from '../../../types'

export type RestReduxActionKey =
  | 'SET_FIELD'
  | 'QUEUE_REQUEST'
  | 'CANCEL_REQUEST'
  | 'FETCH'
  | 'RESPONSE'
  | 'INVALIDATE'
  | 'CLEAR_FIELDS'
  | 'CLEAR_RESPONSE'

export type RestReduxAction = {
  type: string
  payload: Record<string, unknown>
}

export type RestReduxActionSet = Record<RestReduxActionKey, string>

export type RestReduxActionsGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => RestReduxActionSet
