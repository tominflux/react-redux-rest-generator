import { RestApiPayload, RestMethod } from '../../../types'
import { RestReduxActionSet } from '../generateRestActions/types'

export type RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType> = {
  setField: (
    name: keyof AnonResourceType,
    value: unknown
  ) => {
    type: string
    payload: {
      name: keyof AnonResourceType
      value: unknown
    }
  }
  queueRequest: (
    key: string,
    method: RestMethod,
    url: string,
    body: string | null
  ) => {
    type: string
    payload: {
      key: string
      method: string
      url: string
      body: string | null
    }
  }
  cancelRequest: (
    key: string
  ) => {
    type: string
    payload: {
      key: string
    }
  }
  fetch: (
    requestKey: string
  ) => {
    type: string
    payload: { requestKey: string }
  }
  response: (
    key: string,
    status: number,
    message: string,
    apiPayload: RestApiPayload<CompositeIdentifierType, AnonResourceType> | null
  ) => {
    type: string
    payload: {
      key: string
      status: number
      message: string
      apiPayload: RestApiPayload<
        CompositeIdentifierType,
        AnonResourceType
      > | null
    }
  }
  invalidate: () => { type: string; payload: Record<string, never> }
  clearFields: () => { type: string; payload: Record<string, never> }
  clearResponse: () => { type: string; payload: Record<string, never> }
}

export type RestReduxCreatorsGenerator = <
  CompositeIdentifierType,
  AnonResourceType
>(
  actions: RestReduxActionSet
) => RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>
