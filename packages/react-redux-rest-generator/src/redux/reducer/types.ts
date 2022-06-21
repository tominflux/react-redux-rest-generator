import {
  R3gAction,
  R3gActionKeyRecord,
  R3gCancelRequestActionPayload,
  R3gClearFieldsActionPayload,
  R3gClearResponseActionPayload,
  R3gFetchActionPayload,
  R3gInvalidateActionPayload,
  R3gQueueRequestActionPayload,
  R3gResolveActionPayload,
  R3gResponseActionPayload,
  R3gSetFieldActionPayload,
} from '../actions/types'
import { R3gState } from '../types'

// Reducer: Set Field
export type R3gSetFieldReducerParams<
  CompositeIdentifierType,
  AnonResourceType
> = {
  state: R3gState<CompositeIdentifierType, AnonResourceType>
  payload: R3gSetFieldActionPayload<AnonResourceType>
}
export type R3gSetFieldReducer = <CompositeIdentifierType, AnonResourceType>(
  params: R3gSetFieldReducerParams<CompositeIdentifierType, AnonResourceType>
) => R3gState<CompositeIdentifierType, AnonResourceType>

// Reducer: Queue Request
export type R3gQueueRequestReducerParams<
  CompositeIdentifierType,
  AnonResourceType
> = {
  state: R3gState<CompositeIdentifierType, AnonResourceType>
  payload: R3gQueueRequestActionPayload
}
export type R3gQueueRequestReducer = <
  CompositeIdentifierType,
  AnonResourceType
>(
  params: R3gQueueRequestReducerParams<
    CompositeIdentifierType,
    AnonResourceType
  >
) => R3gState<CompositeIdentifierType, AnonResourceType>

// Reducer: Cancel Request
export type R3gCancelRequestReducerParams<
  CompositeIdentifierType,
  AnonResourceType
> = {
  state: R3gState<CompositeIdentifierType, AnonResourceType>
  payload: R3gCancelRequestActionPayload
}
export type R3gCancelRequestReducer = <
  CompositeIdentifierType,
  AnonResourceType
>(
  params: R3gCancelRequestReducerParams<
    CompositeIdentifierType,
    AnonResourceType
  >
) => R3gState<CompositeIdentifierType, AnonResourceType>

// Reducer: Fetch
export type R3gFetchReducerParams<CompositeIdentifierType, AnonResourceType> = {
  state: R3gState<CompositeIdentifierType, AnonResourceType>
  payload: R3gFetchActionPayload
}
export type R3gFetchReducer = <CompositeIdentifierType, AnonResourceType>(
  params: R3gFetchReducerParams<CompositeIdentifierType, AnonResourceType>
) => R3gState<CompositeIdentifierType, AnonResourceType>

// Reducer: Response
export type R3gResponseReducerParams<
  CompositeIdentifierType,
  AnonResourceType
> = {
  state: R3gState<CompositeIdentifierType, AnonResourceType>
  payload: R3gResponseActionPayload<CompositeIdentifierType, AnonResourceType>
  resourceIdentifiers: Array<keyof CompositeIdentifierType>
}
export type R3gResponseReducer = <CompositeIdentifierType, AnonResourceType>(
  params: R3gResponseReducerParams<CompositeIdentifierType, AnonResourceType>
) => R3gState<CompositeIdentifierType, AnonResourceType>

// Reducer: Resolve
export type R3gResolveReducerParams<
  CompositeIdentifierType,
  AnonResourceType
> = {
  state: R3gState<CompositeIdentifierType, AnonResourceType>
  payload: R3gResolveActionPayload
}
export type R3gResolveReducer = <CompositeIdentifierType, AnonResourceType>(
  params: R3gResolveReducerParams<CompositeIdentifierType, AnonResourceType>
) => R3gState<CompositeIdentifierType, AnonResourceType>

// Reducer: Invalidate
export type R3gInvalidateReducerParams<
  CompositeIdentifierType,
  AnonResourceType
> = {
  state: R3gState<CompositeIdentifierType, AnonResourceType>
  payload: R3gInvalidateActionPayload
}
export type R3gInvalidateReducer = <CompositeIdentifierType, AnonResourceType>(
  params: R3gInvalidateReducerParams<CompositeIdentifierType, AnonResourceType>
) => R3gState<CompositeIdentifierType, AnonResourceType>

// Reducer: Clear Fields
export type R3gClearFieldsReducerParams<
  CompositeIdentifierType,
  AnonResourceType
> = {
  state: R3gState<CompositeIdentifierType, AnonResourceType>
  payload: R3gClearFieldsActionPayload
  initialResourceFields: AnonResourceType
}
export type R3gClearFieldsReducer = <CompositeIdentifierType, AnonResourceType>(
  params: R3gClearFieldsReducerParams<CompositeIdentifierType, AnonResourceType>
) => R3gState<CompositeIdentifierType, AnonResourceType>

// Reducer: Clear Response
export type R3gClearResponseReducerParams<
  CompositeIdentifierType,
  AnonResourceType
> = {
  state: R3gState<CompositeIdentifierType, AnonResourceType>
  payload: R3gClearResponseActionPayload
}
export type R3gClearResponseReducer = <
  CompositeIdentifierType,
  AnonResourceType
>(
  params: R3gClearResponseReducerParams<
    CompositeIdentifierType,
    AnonResourceType
  >
) => R3gState<CompositeIdentifierType, AnonResourceType>

// Function: Generic Root Reducer
export type R3gGenericReducerParams<
  CompositeIdentifierType,
  AnonResourceType
> = {
  state: R3gState<CompositeIdentifierType, AnonResourceType>
  action: R3gAction<CompositeIdentifierType, AnonResourceType>
  actionKeyRecord: R3gActionKeyRecord
  resourceIdentifiers: Array<keyof CompositeIdentifierType>
  initialResourceFields: AnonResourceType
}
export type R3gGenericReducer = <CompositeIdentifierType, AnonResourceType>(
  params: R3gGenericReducerParams<CompositeIdentifierType, AnonResourceType>
) => R3gState<CompositeIdentifierType, AnonResourceType>
