import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { RestApiPayload, RestApiReadPayload } from '../../../../types'
import { RestReadPayload } from '../../../generateRestRedux/types'
import { RestSchedulerHookContext } from '../../types'
import RestProcessRequestEventHandler from './types'

const handleProcessRequest: RestProcessRequestEventHandler = async <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  schedulerHookContext: RestSchedulerHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => {
  // Deconstruct context
  const { resourceConfig, state, creators, dispatch } = schedulerHookContext

  // Deconstruct config
  const { apiPayloadResourceListName, name: resourceName } = resourceConfig

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
    const { message, payload: axiosResponsePayload } = axiosResponseData

    // Construct payload
    const getPayload = () => {
      switch (method) {
        case 'get': {
          // Get name of resource list from config or use default
          const listName = apiPayloadResourceListName ?? `${resourceName}List`

          // Deconstruct axios response payload
          const {
            [listName]: resourceList,
          } = axiosResponsePayload as RestApiReadPayload<
            CompositeIdentifierType,
            AnonResourceType
          >

          // Contextualize axios
          const payload: RestReadPayload<
            CompositeIdentifierType,
            AnonResourceType
          > = {
            resourceList,
          }

          return payload
        }
        default:
          return axiosResponsePayload
      }
    }
    const payload = getPayload()

    // Inform reducer of response
    const responseAction = creators.response(
      requestKey,
      hookKey,
      method,
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
      console.error((err as Error).message)
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
      method,
      status,
      message,
      payload
    )
    dispatch(responseAction)
  }
}

export default handleProcessRequest
