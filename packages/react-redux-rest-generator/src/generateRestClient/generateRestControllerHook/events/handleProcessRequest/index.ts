import axios, { AxiosError } from 'axios'
import handleRequestSuccess from './handleRequestSuccess'
import RestProcessRequestEventHandler from './types'
import handleRequestError from './handleRequestError'
import { RestRequest } from '../../../generateRestRedux/types'
import {
  RestAmbiguousResult,
  RestControllerHookContext,
  RestCreatePromiseResolver,
  RestDeletePromiseResolver,
  RestReadPromiseResolver,
  RestUpdatePromiseResolver,
} from '../../types'
import { RestMethod } from '../../../../types'

const handleProcessRequest: RestProcessRequestEventHandler = async <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestControllerHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => {
  // Deconstruct context
  const {
    resourceConfig,
    hookKey,
    state,
    creators,
    dispatch,
    takeCreatePromiseResolver,
    takeReadPromiseResolver,
    takeUpdatePromiseResolver,
    takeDeletePromiseResolver,
  } = hookContext

  // Do nothing if request queue is empty
  if (state.pendingRequests.length === 0) return

  // Get the request promise resolver
  const resolverTakers = {
    post: takeCreatePromiseResolver,
    get: takeReadPromiseResolver,
    put: takeUpdatePromiseResolver,
    delete: takeDeletePromiseResolver,
  }

  // Get next pending request and resolver
  const findMatchedRequestAndResolver: (
    index?: number
  ) => {
    request: RestRequest
    resolver:
      | RestCreatePromiseResolver<CompositeIdentifierType>
      | RestReadPromiseResolver<CompositeIdentifierType, AnonResourceType>
      | RestUpdatePromiseResolver
      | RestDeletePromiseResolver
  } | null = (index = 0) => {
    if (index >= state.pendingRequests.length) return null
    const request = state.pendingRequests[index]
    const { method, requestKey } = request
    const requestPromiseResolver = resolverTakers[method as RestMethod](
      requestKey
    )
    if (requestPromiseResolver === null)
      return findMatchedRequestAndResolver(index + 1)
    return {
      request,
      resolver: requestPromiseResolver,
    }
  }
  const requestAndResolver = findMatchedRequestAndResolver()

  // If does not belong, skip.
  if (requestAndResolver === null) {
    if (resourceConfig.verboseLogging) {
      console.log(
        `R3G - ${resourceConfig.name} - Could not find matched request`,
        {
          hook: hookKey,
        }
      )
    }
    return
  }
  const { request, resolver } = requestAndResolver

  // Determine if request belongs to this hook.
  if (resourceConfig.verboseLogging) {
    console.log(`R3G - ${resourceConfig.name} - Processing Request`, {
      hook: hookKey,
      ...request,
    })
  }

  // Inform reducer that request is being handled
  const { requestKey } = request
  const fetchAction = creators.fetch(requestKey)
  dispatch(fetchAction)

  // Attempt to contact API and run operation
  try {
    // Send request to API
    const { method, url, body } = request
    const response = await axios.request({
      method,
      url,
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Extract information from API response
    const status = response.status
    const message = response.data.message as string
    const payload = response.data.payload as unknown

    // Re-construct into ambiguous REST result
    const result: RestAmbiguousResult = {
      status,
      message,
      payload,
    }

    // Handle request success case
    await handleRequestSuccess<
      CompositeIdentifierType,
      AnonResourceType,
      ReadParamsType
    >(hookContext, request, result, resolver)
  } catch (err) {
    const axiosErr = err as AxiosError

    // Throw error again if not recognizable API error
    if (!axiosErr.isAxiosError || !axiosErr.response) {
      console.error('Processing R3G request failed for unknown reason.')
      throw err
    }

    // Extract information from API response
    const status = axiosErr.response.status
    const message = axiosErr.response.data.message
    const payload = null
    const result: RestAmbiguousResult = { status, message, payload }

    // Extract information from error
    const axiosMessage = axiosErr.message

    // Handle request error case
    handleRequestError<
      CompositeIdentifierType,
      AnonResourceType,
      ReadParamsType
    >(hookContext, request, result, resolver, axiosMessage)
  }
}

export default handleProcessRequest
