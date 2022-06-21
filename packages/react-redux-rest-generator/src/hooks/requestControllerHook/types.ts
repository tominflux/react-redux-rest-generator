import { R3gResourceConfig } from '../../client/types'
import { R3gCreatorRecord } from '../../redux/creators/types'
import {
  R3gCreateResultPayload,
  R3gReadResultPayload,
  R3gRequestMethod,
} from '../../request/types'

/*********************************/
/*******  Data Structures  *******/
/*********************************/

// Create Operation Result
export type R3gCreateOperationSuccessResult<CompositeIdentifierType> = {
  status: number
  message: string
  payload: R3gCreateResultPayload<CompositeIdentifierType>
}
export type R3gCreateOperationErrorResult = {
  status: number
  message: string
  payload: null
}
export type R3gCreateOperationResult<CompositeIdentifierType> =
  | R3gCreateOperationSuccessResult<CompositeIdentifierType>
  | R3gCreateOperationErrorResult

// Read Operation Result
export type R3gReadOperationSuccessResult<
  CompositeIdentifierType,
  AnonResourceType
> = {
  status: number
  message: string
  payload: R3gReadResultPayload<CompositeIdentifierType, AnonResourceType>
}
export type R3gReadOperationErrorResult = {
  status: number
  message: string
  payload: null
}
export type R3gReadOperationResult<CompositeIdentifierType, AnonResourceType> =
  | R3gReadOperationSuccessResult<CompositeIdentifierType, AnonResourceType>
  | R3gReadOperationErrorResult

// Update Operation Result
export type R3gUpdateOperationSuccessResult = {
  status: number
  message: string
  payload: null
}
export type R3gUpdateOperationErrorResult = {
  status: number
  message: string
  payload: null
}
export type R3gUpdateOperationResult =
  | R3gUpdateOperationSuccessResult
  | R3gUpdateOperationErrorResult

// Delete Operation Result
export type R3gDeleteOperationSuccessResult = {
  status: number
  message: string
  payload: null
}
export type R3gDeleteOperationErrorResult = {
  status: number
  message: string
  payload: null
}
export type R3gDeleteOperationResult =
  | R3gDeleteOperationSuccessResult
  | R3gDeleteOperationErrorResult

//

export type R3gRequestController<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = {
  // API
  fetching: boolean
  method: R3gRequestMethod | null
  status: number | null
  message: string | null
  clearResponse: () => void
  // CRUD
  create: (
    parentsIdentifier?: Record<string, string>,
    overrideData?: AnonResourceType
  ) => Promise<R3gCreateOperationResult<CompositeIdentifierType>>
  read: (
    params: ReadParamsType
  ) => Promise<
    R3gReadOperationResult<CompositeIdentifierType, AnonResourceType>
  >
  update: (
    compositeIdentifier: CompositeIdentifierType,
    overrideData?: AnonResourceType
  ) => Promise<R3gUpdateOperationResult>
  delete: (
    compositeIdentifier: CompositeIdentifierType
  ) => Promise<R3gDeleteOperationResult>
  // Form
  getField: (name: keyof AnonResourceType) => unknown
  setField: (name: keyof AnonResourceType, value: unknown) => void
  clearFields: () => void
  // Cache
  getMany: (
    params?: ReadParamsType
  ) => Array<CompositeIdentifierType & AnonResourceType>
  getOne: (
    compositeIdentifier: CompositeIdentifierType
  ) => (CompositeIdentifierType & AnonResourceType) | null
  invalidate: () => void
}

export type R3gGenericRequestControllerHook = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  creators: R3gCreatorRecord<CompositeIdentifierType, AnonResourceType>,
  resourceConfig: R3gResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => R3gRequestController<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>
