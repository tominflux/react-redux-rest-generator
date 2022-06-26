import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import R3gRequestFunctions from '../../request/functions'
import { R3gAxiosResponseData } from '../../request/types'
import {
  ExecuteAxiosRequestOperation,
  ExecuteAxiosRequestOperationParams,
} from './types'

// Operation: Execute Axios Request
const executeAxiosRequest: ExecuteAxiosRequestOperation = async <
  ResourceIdentifier,
  ResourceBody
>({
  hookKey,
  requestKey,
  resourceListName,
  resourceIdentifierKeys,
  resourcePropertyKeys,
  method,
  url,
  body,
}: ExecuteAxiosRequestOperationParams) => {
  // Try: Execute request
  try {
    // Construct: Axios request config
    const axiosRequestConfig: AxiosRequestConfig = {
      method,
      url,
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    // Axios: Execute request
    const axiosResponse = await axios.request<
      R3gAxiosResponseData<ResourceIdentifier, ResourceBody>
    >(axiosRequestConfig)

    // Validate: Axios response
    const axiosResponseValidationState = R3gRequestFunctions.validateAxiosResponse<
      ResourceIdentifier,
      ResourceBody
    >({
      resourceIdentifierKeys,
      resourceListName,
      resourcePropertyKeys,
      method,
      axiosResponse,
    })

    // Throw: If response is not valid
    if (axiosResponseValidationState !== 'VALID') {
      throw new Error(
        `R3G: Invalid Axios response... '${axiosResponseValidationState}'`
      )
    }

    // Deconstruct: Response
    const { status, data: axiosResponseData } = axiosResponse

    // Derive: Request result
    const requestResult = R3gRequestFunctions.getRequestResult<
      ResourceIdentifier,
      ResourceBody
    >({
      hookKey,
      requestKey,
      method,
      status,
      axiosResponseData,
    })

    return requestResult
  } catch (err) {
    // Contextualize: error
    const axiosErr = err as AxiosError<
      R3gAxiosResponseData<ResourceIdentifier, ResourceBody>
    >

    // Throw: If not axios error
    if (!axiosErr.isAxiosError || !axiosErr.response) {
      console.error((err as Error).message)
      console.error('R3G: Executing request failed for unknown reason.')
      throw err
    }

    // Deconstruct: axios error
    const { response: axiosResponse } = axiosErr

    // Validate: Axios response
    const axiosResponseValidationState = R3gRequestFunctions.validateAxiosResponse<
      ResourceIdentifier,
      ResourceBody
    >({
      resourceIdentifierKeys,
      resourceListName,
      resourcePropertyKeys,
      method,
      axiosResponse,
    })

    // Throw: If response is not valid
    if (axiosResponseValidationState !== 'VALID') {
      throw new Error(
        `R3G: Invalid Axios response... '${axiosResponseValidationState}'`
      )
    }

    // Deconstruct: axios response
    const { status, data: axiosResponseData } = axiosResponse

    // Derive: Request result
    const requestResult = R3gRequestFunctions.getRequestResult<
      ResourceIdentifier,
      ResourceBody
    >({
      hookKey,
      requestKey,
      method,
      status,
      axiosResponseData,
    })

    return requestResult
  }
}

// Construct: Request Scheduler Hook Operations
const RequestSchedulerHookOperations = {
  executeAxiosRequest,
}

export default RequestSchedulerHookOperations
