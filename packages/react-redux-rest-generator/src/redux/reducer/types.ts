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
export type R3gSetFieldReducerParams<ResourceIdentifier, ResourceBody> = {
  state: R3gState<ResourceIdentifier, ResourceBody>
  payload: R3gSetFieldActionPayload<ResourceBody>
}
export type R3gSetFieldReducer = <ResourceIdentifier, ResourceBody>(
  params: R3gSetFieldReducerParams<ResourceIdentifier, ResourceBody>
) => R3gState<ResourceIdentifier, ResourceBody>

// Reducer: Queue Request
export type R3gQueueRequestReducerParams<ResourceIdentifier, ResourceBody> = {
  state: R3gState<ResourceIdentifier, ResourceBody>
  payload: R3gQueueRequestActionPayload
}
export type R3gQueueRequestReducer = <ResourceIdentifier, ResourceBody>(
  params: R3gQueueRequestReducerParams<ResourceIdentifier, ResourceBody>
) => R3gState<ResourceIdentifier, ResourceBody>

// Reducer: Cancel Request
export type R3gCancelRequestReducerParams<ResourceIdentifier, ResourceBody> = {
  state: R3gState<ResourceIdentifier, ResourceBody>
  payload: R3gCancelRequestActionPayload
}
export type R3gCancelRequestReducer = <ResourceIdentifier, ResourceBody>(
  params: R3gCancelRequestReducerParams<ResourceIdentifier, ResourceBody>
) => R3gState<ResourceIdentifier, ResourceBody>

// Reducer: Fetch
export type R3gFetchReducerParams<ResourceIdentifier, ResourceBody> = {
  state: R3gState<ResourceIdentifier, ResourceBody>
  payload: R3gFetchActionPayload
}
export type R3gFetchReducer = <ResourceIdentifier, ResourceBody>(
  params: R3gFetchReducerParams<ResourceIdentifier, ResourceBody>
) => R3gState<ResourceIdentifier, ResourceBody>

// Reducer: Response
export type R3gResponseReducerParams<ResourceIdentifier, ResourceBody> = {
  state: R3gState<ResourceIdentifier, ResourceBody>
  payload: R3gResponseActionPayload<ResourceIdentifier, ResourceBody>
  resourceIdentifiers: Array<keyof ResourceIdentifier>
  resourceListName: string
}
export type R3gResponseReducer = <ResourceIdentifier, ResourceBody>(
  params: R3gResponseReducerParams<ResourceIdentifier, ResourceBody>
) => R3gState<ResourceIdentifier, ResourceBody>

// Reducer: Resolve
export type R3gResolveReducerParams<ResourceIdentifier, ResourceBody> = {
  state: R3gState<ResourceIdentifier, ResourceBody>
  payload: R3gResolveActionPayload
}
export type R3gResolveReducer = <ResourceIdentifier, ResourceBody>(
  params: R3gResolveReducerParams<ResourceIdentifier, ResourceBody>
) => R3gState<ResourceIdentifier, ResourceBody>

// Reducer: Invalidate
export type R3gInvalidateReducerParams<ResourceIdentifier, ResourceBody> = {
  state: R3gState<ResourceIdentifier, ResourceBody>
  payload: R3gInvalidateActionPayload
}
export type R3gInvalidateReducer = <ResourceIdentifier, ResourceBody>(
  params: R3gInvalidateReducerParams<ResourceIdentifier, ResourceBody>
) => R3gState<ResourceIdentifier, ResourceBody>

// Reducer: Clear Fields
export type R3gClearFieldsReducerParams<ResourceIdentifier, ResourceBody> = {
  state: R3gState<ResourceIdentifier, ResourceBody>
  payload: R3gClearFieldsActionPayload
  initialResourceFields: ResourceBody
}
export type R3gClearFieldsReducer = <ResourceIdentifier, ResourceBody>(
  params: R3gClearFieldsReducerParams<ResourceIdentifier, ResourceBody>
) => R3gState<ResourceIdentifier, ResourceBody>

// Reducer: Clear Response
export type R3gClearResponseReducerParams<ResourceIdentifier, ResourceBody> = {
  state: R3gState<ResourceIdentifier, ResourceBody>
  payload: R3gClearResponseActionPayload
}
export type R3gClearResponseReducer = <ResourceIdentifier, ResourceBody>(
  params: R3gClearResponseReducerParams<ResourceIdentifier, ResourceBody>
) => R3gState<ResourceIdentifier, ResourceBody>

// Function: Generic Root Reducer
export type R3gGenericReducerParams<ResourceIdentifier, ResourceBody> = {
  state: R3gState<ResourceIdentifier, ResourceBody>
  action: R3gAction<ResourceIdentifier, ResourceBody>
  actionKeyRecord: R3gActionKeyRecord
  resourceIdentifiers: Array<keyof ResourceIdentifier>
  resourceListName: string
  initialResourceFields: ResourceBody
}
export type R3gGenericReducer = <ResourceIdentifier, ResourceBody>(
  params: R3gGenericReducerParams<ResourceIdentifier, ResourceBody>
) => R3gState<ResourceIdentifier, ResourceBody>
