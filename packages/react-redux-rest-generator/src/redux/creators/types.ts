import { R3gRequestMethod, R3gRequestResult } from '../../request/types'
import {
  R3gActionKeyRecord,
  R3gCancelRequestAction,
  R3gClearFieldsAction,
  R3gClearResponseAction,
  R3gFetchAction,
  R3gInvalidateAction,
  R3gQueueRequestAction,
  R3gResolveAction,
  R3gResponseAction,
  R3gSetFieldAction,
} from '../actions/types'

/*********************************/
/*******  Redux Creators  ********/
/*********************************/

export type R3gSetFieldCreator<AnonResourceType> = (
  name: keyof AnonResourceType,
  value: unknown
) => R3gSetFieldAction<AnonResourceType>

export type R3gQueueRequestCreator = (
  requestKey: string,
  hookKey: string,
  method: R3gRequestMethod,
  url: string,
  body: string | null
) => R3gQueueRequestAction

export type R3gCancelRequestCreator = (
  requestKey: string
) => R3gCancelRequestAction

export type R3gFetchCreator = (requestKey: string) => R3gFetchAction

export type R3gResolveCreator = (requestKey: string) => R3gResolveAction

export type R3gResponseCreator<CompositeIdentifierType, AnonResourceType> = (
  requestResult: R3gRequestResult<CompositeIdentifierType, AnonResourceType>
) => R3gResponseAction<CompositeIdentifierType, AnonResourceType>

export type R3gInvalidateCreator = () => R3gInvalidateAction

export type R3gClearFieldsCreator = () => R3gClearFieldsAction

export type R3gClearResponseCreator = () => R3gClearResponseAction

/*********************************/
/*******  Data Structures  *******/
/*********************************/

export type R3gCreatorRecord<CompositeIdentifierType, AnonResourceType> = {
  setField: R3gSetFieldCreator<AnonResourceType>
  queueRequest: R3gQueueRequestCreator
  cancelRequest: R3gCancelRequestCreator
  fetch: R3gFetchCreator
  response: R3gResponseCreator<CompositeIdentifierType, AnonResourceType>
  resolve: R3gResolveCreator
  invalidate: R3gInvalidateCreator
  clearFields: R3gClearFieldsCreator
  clearResponse: R3gClearResponseCreator
}

/*********************************/
/*********  Functions  ***********/
/*********************************/

export type GetR3gCreatorFunctionParams = {
  actionKeyRecord: R3gActionKeyRecord
}
export type GetR3gCreatorFunction = <CompositeIdentifierType, AnonResourceType>(
  params: GetR3gCreatorFunctionParams
) => R3gCreatorRecord<CompositeIdentifierType, AnonResourceType>
