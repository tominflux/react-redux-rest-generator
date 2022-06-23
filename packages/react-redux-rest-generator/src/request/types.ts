import { AxiosResponse } from 'axios'
import { R3gResourceConfig } from '../client/types'

/*********************************/
/*********  Primitives  **********/
/*********************************/

// Request Method
export type R3gRequestMethod = 'get' | 'post' | 'put' | 'delete'

/*********************************/
/*******  Data Structures  *******/
/*********************************/

// Create Result Payload
export type R3gCreateResultPayload<
  ResourceIdentifier
> = ResourceIdentifier | null

// Read Result Payload
export type R3gReadResultPayload<ResourceIdentifier, ResourceBody> = Record<
  string,
  Array<ResourceIdentifier & ResourceBody>
>

// Ambiguous Result Payload
export type R3gRequestResultPayload<ResourceIdentifier, ResourceBody> =
  | R3gCreateResultPayload<ResourceIdentifier>
  | R3gReadResultPayload<ResourceIdentifier, ResourceBody>
  | null

// Data Structure: Axios Create Response Data
export type R3gAxiosCreateSuccessResponseData<ResourceIdentifier> = {
  message: string
  payload: R3gCreateResultPayload<ResourceIdentifier>
}
export type R3gAxiosCreateErrorResponseData = {
  message: string
  payload: null
}

// Data Structure: Axios Read Response Data
export type R3gAxiosReadSuccessResponseData<
  ResourceIdentifier,
  ResourceBody
> = {
  message: string
  payload: R3gReadResultPayload<ResourceIdentifier, ResourceBody>
}
export type R3gAxiosReadErrorResponseData = {
  message: string
  payload: null
}

// Data Structure: Axios Update Response Data
export type R3gAxiosUpdateSuccessResponseData = {
  message: string
  payload: null
}
export type R3gAxiosUpdateErrorResponseData = {
  message: string
  payload: null
}

// Data Structure: Axios Delete Response Data
export type R3gAxiosDeleteSuccessResponseData = {
  message: string
  payload: null
}
export type R3gAxiosDeleteErrorResponseData = {
  message: string
  payload: null
}

// Data Structure: Axios Ambiguous Response Data
export type R3gAxiosResponseData<ResourceIdentifier, ResourceBody> =
  | R3gAxiosCreateSuccessResponseData<ResourceIdentifier>
  | R3gAxiosCreateErrorResponseData
  | R3gAxiosReadSuccessResponseData<ResourceIdentifier, ResourceBody>
  | R3gAxiosReadErrorResponseData
  | R3gAxiosUpdateSuccessResponseData
  | R3gAxiosUpdateErrorResponseData
  | R3gAxiosDeleteSuccessResponseData
  | R3gAxiosDeleteErrorResponseData

// Request
export type R3gRequest = {
  requestKey: string
  hookKey: string
  method: R3gRequestMethod
  url: string
  body: string | null
}

// Create Request Result
export type R3gCreateRequestSuccessResult<ResourceIdentifier> = {
  requestKey: string
  hookKey: string
  method: 'post'
  status: number
  success: true
  message: string
  payload: R3gCreateResultPayload<ResourceIdentifier>
}
export type R3gCreateRequestErrorResult = {
  requestKey: string
  hookKey: string
  method: 'post'
  status: number
  success: false
  message: string
  payload: null
}

// Read Request Result
export type R3gReadRequestSuccessResult<ResourceIdentifier, ResourceBody> = {
  requestKey: string
  hookKey: string
  method: 'get'
  status: number
  success: true
  message: string
  payload: R3gReadResultPayload<ResourceIdentifier, ResourceBody>
}
export type R3gReadRequestErrorResult = {
  requestKey: string
  hookKey: string
  method: 'get'
  status: number
  success: false
  message: string
  payload: null
}

// Update Request Result
export type R3gUpdateRequestSuccessResult = {
  requestKey: string
  hookKey: string
  method: 'put'
  status: number
  success: true
  message: string
  payload: null
}
export type R3gUpdateRequestErrorResult = {
  requestKey: string
  hookKey: string
  method: 'put'
  status: number
  success: false
  message: string
  payload: null
}

// Delete Request Result
export type R3gDeleteRequestSuccessResult = {
  requestKey: string
  hookKey: string
  method: 'delete'
  status: number
  success: true
  message: string
  payload: null
}
export type R3gDeleteRequestErrorResult = {
  requestKey: string
  hookKey: string
  method: 'delete'
  status: number
  success: false
  message: string
  payload: null
}

// Generic Request Result
export type R3gRequestResult<ResourceIdentifier, ResourceBody> =
  | R3gCreateRequestSuccessResult<ResourceIdentifier>
  | R3gCreateRequestErrorResult
  | R3gReadRequestSuccessResult<ResourceIdentifier, ResourceBody>
  | R3gReadRequestErrorResult
  | R3gUpdateRequestSuccessResult
  | R3gUpdateRequestErrorResult
  | R3gDeleteRequestSuccessResult
  | R3gDeleteRequestErrorResult

/*********************************/
/*********  Functions  ***********/
/*********************************/

// Function: Axios Response Validator
export type R3gAxiosResponseValidationState =
  | 'VALID'
  | 'UNEXPECTED_PAYLOAD'
  | 'NO_MESSAGE'
  | 'NO_PAYLOAD'
  | 'WRONG_PAYLOAD_FORMAT'
  | 'UNRECOGNIZED_METHOD'
export type R3gAxiosResponseValidatorParams<
  ResourceIdentifier,
  ResourceBody
> = {
  resourceIdentifierKeys: Array<string>
  resourceListName: string
  resourcePropertyKeys: Array<string>
  method: R3gRequestMethod
  axiosResponse: AxiosResponse<
    R3gAxiosResponseData<ResourceIdentifier, ResourceBody>
  >
}
export type R3gAxiosResponseValidator = <ResourceIdentifier, ResourceBody>(
  params: R3gAxiosResponseValidatorParams<ResourceIdentifier, ResourceBody>
) => R3gAxiosResponseValidationState

// Function: Get Request Result
export type R3gRequestResultGetterParams<ResourceIdentifier, ResourceBody> = {
  hookKey: string
  requestKey: string
  method: R3gRequestMethod
  status: number
  axiosResponseData: R3gAxiosResponseData<ResourceIdentifier, ResourceBody>
}
export type R3gRequestResultGetter = <ResourceIdentifier, ResourceBody>(
  params: R3gRequestResultGetterParams<ResourceIdentifier, ResourceBody>
) => R3gRequestResult<ResourceIdentifier, ResourceBody>

// Function: Param Stringification Validator
export type R3gStringifiedParamsGetterValidationState =
  | 'VALID'
  | 'INVALID_ARRAY_ELEMENT'
  | 'NO_TO_STRING_METHOD'
export type R3gStringifiedParamsGetterValidatorResult = {
  validationStatus: R3gStringifiedParamsGetterValidationState
  erroneousParamKey: string | null
}
export type R3gStringifiedParamsGetterValidator = (
  params: Record<string, unknown>
) => R3gStringifiedParamsGetterValidatorResult

// Function: Stringified Params Getter
export type R3gStringifiedParamsGetter = (
  params: Record<string, unknown>
) => Record<string, string | null>

// Function: Single Anonymous Resource API Url Getter
export type R3gSingleAnonApiUrlGetterParams<
  ResourceIdentifier,
  ResourceBody,
  ReadParams
> = {
  parentsIdentifier: Record<string, string>
  resourceConfig: R3gResourceConfig<
    ResourceIdentifier,
    ResourceBody,
    ReadParams
  >
}
export type R3gSingleAnonApiUrlGetter = <
  ResourceIdentifier,
  ResourceBody,
  ReadParams
>(
  params: R3gSingleAnonApiUrlGetterParams<
    ResourceIdentifier,
    ResourceBody,
    ReadParams
  >
) => string

// Function: Single Resource API URL Getter
export type R3gSingleApiUrlGetterParams<
  ResourceIdentifier,
  ResourceBody,
  ReadParams
> = {
  resourceIdentifier: ResourceIdentifier
  resourceConfig: R3gResourceConfig<
    ResourceIdentifier,
    ResourceBody,
    ReadParams
  >
}
export type R3gSingleApiUrlGetter = <
  ResourceIdentifier,
  ResourceBody,
  ReadParams
>(
  params: R3gSingleApiUrlGetterParams<
    ResourceIdentifier,
    ResourceBody,
    ReadParams
  >
) => string

// Function: Many Resource API URL Getter
export type R3gManyApiUrlGetterParams<
  ResourceIdentifier,
  ResourceBody,
  ReadParams
> = {
  readParams: ReadParams
  resourceConfig: R3gResourceConfig<
    ResourceIdentifier,
    ResourceBody,
    ReadParams
  >
}
export type R3gManyApiUrlGetter = <
  ResourceIdentifier,
  ResourceBody,
  ReadParams
>(
  params: R3gManyApiUrlGetterParams<
    ResourceIdentifier,
    ResourceBody,
    ReadParams
  >
) => string
