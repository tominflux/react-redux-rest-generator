import axios, { AxiosError } from 'axios'
import {
  RestCreatePromiseResolver,
  RestCreateResult,
  RestDeletePromiseResolver,
  RestDeleteResult,
  RestReadPromiseResolver,
  RestReadResult,
  RestRequest,
  RestUpdatePromiseResolver,
  RestUpdateResult,
} from '../../../../types'
import { RestHookContext } from '../../types'
import handleProcessCreateError from './handleProcessCreateError'
import handleProcessCreateRequest from './handleProcessCreateRequest'
import handleProcessDeleteRequest from './handleProcessDeleteRequest'
import handleProcessReadRequest from './handleProcessReadRequest'
import handleProcessUpdateRequest from './handleProcessUpdateRequest'
import RestProcessRequestEventHandler from './types'

const handleProcessRequest: RestProcessRequestEventHandler = async <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestHookContext<
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
    const { method, key } = request
    const requestPromiseResolver = resolverTakers[method](key)
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
  const { key } = request
  const fetchAction = creators.fetch(key)
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

    //
    switch (method) {
      // CREATE
      case 'post': {
        const result: RestCreateResult<CompositeIdentifierType> = {
          status,
          message,
          compositeIdentifier: payload as CompositeIdentifierType,
        }

        handleProcessCreateRequest<
          CompositeIdentifierType,
          AnonResourceType,
          ReadParamsType
        >(
          hookContext,
          request,
          result,
          resolver as RestCreatePromiseResolver<CompositeIdentifierType>
        )
        break
      }
      // READ
      case 'get': {
        // Extract resource list from payload
        const listName =
          resourceConfig.apiPayloadResourceListName ??
          `${resourceConfig.name}List`
        const { [listName]: resourceList } = payload as Record<
          string,
          Array<CompositeIdentifierType & AnonResourceType>
        >

        // Compose read request result
        const result: RestReadResult<
          CompositeIdentifierType,
          AnonResourceType
        > = {
          status,
          message,
          resourceList,
        }

        handleProcessReadRequest<
          CompositeIdentifierType,
          AnonResourceType,
          ReadParamsType
        >(
          hookContext,
          request,
          result,
          resolver as RestReadPromiseResolver<
            CompositeIdentifierType,
            AnonResourceType
          >
        )

        break
      }
      // UPDATE & DELETE
      case 'put': {
        const result: RestUpdateResult = {
          status,
          message,
        }

        handleProcessUpdateRequest<
          CompositeIdentifierType,
          AnonResourceType,
          ReadParamsType
        >(hookContext, request, result, resolver as RestUpdatePromiseResolver)

        break
      }
      case 'delete': {
        const result: RestDeleteResult = {
          status,
          message,
        }

        handleProcessDeleteRequest<
          CompositeIdentifierType,
          AnonResourceType,
          ReadParamsType
        >(hookContext, request, result, resolver as RestUpdatePromiseResolver)

        break
      }
    }
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

    // Log both axios error message and API error message
    console.error(axiosErr.message)
    console.error(message)

    // Dispatch response action & resolve promise
    const { method } = request
    switch (method) {
      // CREATE
      case 'post': {
        const result: RestCreateResult<CompositeIdentifierType> = {
          status,
          message,
          compositeIdentifier: null,
        }

        handleProcessCreateError(
          hookContext,
          request,
          result,
          resolver as RestCreatePromiseResolver<CompositeIdentifierType>
        )

        break
      }
      // READ
      case 'get': {
        const result: RestReadResult<
          CompositeIdentifierType,
          AnonResourceType
        > = {
          status,
          message,
          resourceList: [],
        }

        handleProcessReadRequest(
          hookContext,
          request,
          result,
          resolver as RestReadPromiseResolver<
            CompositeIdentifierType,
            AnonResourceType
          >
        )

        break
      }
      // UPDATE
      case 'put': {
        const result: RestUpdateResult = {
          status,
          message,
        }

        handleProcessUpdateRequest(
          hookContext,
          request,
          result,
          resolver as RestUpdatePromiseResolver
        )

        break
      }
      // DELETE
      case 'delete': {
        const result: RestDeleteResult = {
          status,
          message,
        }

        handleProcessDeleteRequest(
          hookContext,
          request,
          result,
          resolver as RestDeletePromiseResolver
        )

        break
      }
    }
  }
}

export default handleProcessRequest
