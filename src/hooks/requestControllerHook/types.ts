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
export type R3gCreateOperationSuccessResult<ResourceIdentifier> = {
  status: number
  message: string
  payload: R3gCreateResultPayload<ResourceIdentifier>
}
export type R3gCreateOperationErrorResult = {
  status: number
  message: string
  payload: null
}
export type R3gCreateOperationResult<ResourceIdentifier> =
  | R3gCreateOperationSuccessResult<ResourceIdentifier>
  | R3gCreateOperationErrorResult

// Read Operation Result
export type R3gReadOperationSuccessResult<ResourceIdentifier, ResourceBody> = {
  status: number
  message: string
  payload: R3gReadResultPayload<ResourceIdentifier, ResourceBody>
}
export type R3gReadOperationErrorResult = {
  status: number
  message: string
  payload: null
}
export type R3gReadOperationResult<ResourceIdentifier, ResourceBody> =
  | R3gReadOperationSuccessResult<ResourceIdentifier, ResourceBody>
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
  ResourceIdentifier,
  ResourceBody,
  ReadParams
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
    overrideData?: ResourceBody
  ) => Promise<R3gCreateOperationResult<ResourceIdentifier>>
  read: (
    params: ReadParams
  ) => Promise<R3gReadOperationResult<ResourceIdentifier, ResourceBody>>
  update: (
    resourceIdentifier: ResourceIdentifier,
    overrideData?: ResourceBody
  ) => Promise<R3gUpdateOperationResult>
  delete: (
    resourceIdentifier: ResourceIdentifier
  ) => Promise<R3gDeleteOperationResult>
  // Form
  getField: (name: keyof ResourceBody) => unknown
  setField: (name: keyof ResourceBody, value: unknown) => void
  clearFields: () => void
  // Cache
  getMany: (params?: ReadParams) => Array<ResourceIdentifier & ResourceBody>
  getOne: (
    resourceIdentifier: ResourceIdentifier
  ) => (ResourceIdentifier & ResourceBody) | null
  invalidate: () => void
}

export type R3gGenericRequestControllerHook = <
  ResourceIdentifier,
  ResourceBody,
  ReadParams
>(
  creators: R3gCreatorRecord<ResourceIdentifier, ResourceBody>,
  resourceConfig: R3gResourceConfig<
    ResourceIdentifier,
    ResourceBody,
    ReadParams
  >
) => R3gRequestController<ResourceIdentifier, ResourceBody, ReadParams>
