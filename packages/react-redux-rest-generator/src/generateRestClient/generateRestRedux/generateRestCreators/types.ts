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
    requestKey: string,
    hookKey: string,
    method: RestMethod,
    url: string,
    body: string | null
  ) => {
    type: string
    payload: {
      requestKey: string
      hookKey: string
      method: string
      url: string
      body: string | null
    }
  }
  cancelRequest: (
    requestKey: string
  ) => {
    type: string
    payload: {
      requestKey: string
    }
  }
  fetch: (
    requestKey: string
  ) => {
    type: string
    payload: { requestKey: string }
  }
  response: (
    requestKey: string,
    hookKey: string,
    method: RestMethod,
    status: number,
    message: string,
    apiPayload: RestApiPayload<CompositeIdentifierType, AnonResourceType> | null
  ) => {
    type: string
    payload: {
      requestKey: string
      hookKey: string
      method: RestMethod
      status: number
      message: string
      apiPayload: RestApiPayload<
        CompositeIdentifierType,
        AnonResourceType
      > | null
    }
  }
  resolve: (
    requestKey: string
  ) => {
    type: string
    payload: { requestKey: string }
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
