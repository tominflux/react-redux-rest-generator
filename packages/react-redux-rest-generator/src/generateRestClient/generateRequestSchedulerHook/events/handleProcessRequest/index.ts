import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { RestApiPayload } from '../../../../types'
import { RestSchedulerHookContext } from '../../types'
import RestProcessRequestEventHandler from './types'

const handleProcessRequest: RestProcessRequestEventHandler = async <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestSchedulerHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => {
  // Deconstruct context
  const { state, creators, dispatch } = hookContext

  // Deconstruct state
  const { pendingRequests } = state

  // Select first request from pending requests
  const [currentRequest] = pendingRequests

  // If no requests, skip
  if ((currentRequest ?? null) === null) {
    return
  }

  // Deconstruct request information
  const { requestKey, hookKey, method, url, body } = currentRequest

  // Inform reducer that request is being handled
  const fetchAction = creators.fetch(requestKey)
  dispatch(fetchAction)

  // Attempt to perform operation
  try {
    // Construct axios request config
    const axiosRequestConfig: AxiosRequestConfig = {
      method,
      url,
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    // Send request to API
    const axiosResponse = await axios.request<{
      message: string
      payload: RestApiPayload<CompositeIdentifierType, AnonResourceType> | null
    }>(axiosRequestConfig)

    // Deconstruct response
    const { status, data: axiosResponseData } = axiosResponse

    // Deconstruct response data
    const { message, payload } = axiosResponseData

    // Inform reducer of response
    const responseAction = creators.response(
      requestKey,
      hookKey,
      status,
      message,
      payload
    )
    dispatch(responseAction)
  } catch (err) {
    // Contextualize error
    const axiosErr = err as AxiosError<{
      message: string
      payload: null
    }>

    // Throw error again if not recognizable API error
    if (!axiosErr.isAxiosError || !axiosErr.response) {
      console.error('Performing REST operation failed for unknown reason.')
      throw err
    }

    // Deconstruct axios error
    const { response: axiosResponse } = axiosErr

    // Deconstruct axios response
    const { status, data: axiosResponseData } = axiosResponse

    // Deconstruct axios response data
    const { message, payload } = axiosResponseData

    // Inform reducer of response
    const responseAction = creators.response(
      requestKey,
      hookKey,
      status,
      message,
      payload
    )
    dispatch(responseAction)
  }
}

export default handleProcessRequest
