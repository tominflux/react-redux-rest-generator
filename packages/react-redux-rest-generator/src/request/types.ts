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
  CompositeIdentifierType
> = CompositeIdentifierType | null

// Read Result Payload
export type R3gReadResultPayload<
  CompositeIdentifierType,
  AnonResourceType
> = Record<string, Array<CompositeIdentifierType & AnonResourceType>>

// Ambiguous Result Payload
export type R3gRequestResultPayload<
  CompositeIdentifierType,
  AnonResourceType
> =
  | R3gCreateResultPayload<CompositeIdentifierType>
  | R3gReadResultPayload<CompositeIdentifierType, AnonResourceType>
  | null

// Data Structure: Axios Create Response Data
export type R3gAxiosCreateSuccessResponseData<CompositeIdentifierType> = {
  message: string
  payload: R3gCreateResultPayload<CompositeIdentifierType>
}
export type R3gAxiosCreateErrorResponseData = {
  message: string
  payload: null
}

// Data Structure: Axios Read Response Data
export type R3gAxiosReadSuccessResponseData<
  CompositeIdentifierType,
  AnonResourceType
> = {
  message: string
  payload: R3gReadResultPayload<CompositeIdentifierType, AnonResourceType>
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
export type R3gAxiosResponseData<CompositeIdentifierType, AnonResourceType> =
  | R3gAxiosCreateSuccessResponseData<CompositeIdentifierType>
  | R3gAxiosCreateErrorResponseData
  | R3gAxiosReadSuccessResponseData<CompositeIdentifierType, AnonResourceType>
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
export type R3gCreateRequestSuccessResult<CompositeIdentifierType> = {
  requestKey: string
  hookKey: string
  method: 'post'
  status: number
  success: true
  message: string
  payload: R3gCreateResultPayload<CompositeIdentifierType>
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
export type R3gReadRequestSuccessResult<
  CompositeIdentifierType,
  AnonResourceType
> = {
  requestKey: string
  hookKey: string
  method: 'get'
  status: number
  success: true
  message: string
  payload: R3gReadResultPayload<CompositeIdentifierType, AnonResourceType>
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
export type R3gRequestResult<CompositeIdentifierType, AnonResourceType> =
  | R3gCreateRequestSuccessResult<CompositeIdentifierType>
  | R3gCreateRequestErrorResult
  | R3gReadRequestSuccessResult<CompositeIdentifierType, AnonResourceType>
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
  CompositeIdentifierType,
  AnonResourceType
> = {
  resourceIdentifierKeys: Array<string>
  resourceListName: string
  resourcePropertyKeys: Array<string>
  method: R3gRequestMethod
  axiosResponse: AxiosResponse<
    R3gAxiosResponseData<CompositeIdentifierType, AnonResourceType>
  >
}
export type R3gAxiosResponseValidator = <
  CompositeIdentifierType,
  AnonResourceType
>(
  params: R3gAxiosResponseValidatorParams<
    CompositeIdentifierType,
    AnonResourceType
  >
) => R3gAxiosResponseValidationState

// Function: Get Request Result
export type R3gRequestResultGetterParams<
  CompositeIdentifierType,
  AnonResourceType
> = {
  hookKey: string
  requestKey: string
  method: R3gRequestMethod
  status: number
  axiosResponseData: R3gAxiosResponseData<
    CompositeIdentifierType,
    AnonResourceType
  >
}
export type R3gRequestResultGetter = <
  CompositeIdentifierType,
  AnonResourceType
>(
  params: R3gRequestResultGetterParams<
    CompositeIdentifierType,
    AnonResourceType
  >
) => R3gRequestResult<CompositeIdentifierType, AnonResourceType>

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
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = {
  parentsIdentifier: Record<string, string>
  resourceConfig: R3gResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
}
export type R3gSingleAnonApiUrlGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  params: R3gSingleAnonApiUrlGetterParams<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => string

// Function: Single Resource API URL Getter
export type R3gSingleApiUrlGetterParams<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = {
  resourceIdentifier: CompositeIdentifierType
  resourceConfig: R3gResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
}
export type R3gSingleApiUrlGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  params: R3gSingleApiUrlGetterParams<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => string

// Function: Many Resource API URL Getter
export type R3gManyApiUrlGetterParams<
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
> = {
  readParams: ReadParamsType
  resourceConfig: R3gResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
}
export type R3gManyApiUrlGetter = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  params: R3gManyApiUrlGetterParams<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => string
