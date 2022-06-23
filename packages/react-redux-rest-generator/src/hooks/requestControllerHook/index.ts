import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from 'redux'
import { R3gResourceConfig } from '../../client/types'
import { R3gAction } from '../../redux/actions/types'
import { R3gCreatorRecord } from '../../redux/creators/types'
import { R3gState } from '../../redux/types'
import R3gRequestFunctions from '../../request/functions'
import generateUuid from '../../utils/generateUuid'
import useRequestPromiseController from './hooks/useRequestPromiseController'
import {
  R3gCreatePromiseResolver,
  R3gDeletePromiseResolver,
  R3gReadPromiseResolver,
  R3gUpdatePromiseResolver,
} from './hooks/useRequestPromiseController/types'
import {
  R3gCreateOperationResult,
  R3gDeleteOperationResult,
  R3gGenericRequestControllerHook,
  R3gReadOperationResult,
  R3gUpdateOperationResult,
} from './types'

const useRequestController: R3gGenericRequestControllerHook = <
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
) => {
  // Redux
  const stateName = resourceConfig.stateName ?? `${resourceConfig.name}State`
  const state = useSelector<
    Record<string | number | symbol, unknown>,
    R3gState<ResourceIdentifier, ResourceBody>
  >((state) => state[stateName] as R3gState<ResourceIdentifier, ResourceBody>)
  const dispatch = useDispatch<
    Dispatch<R3gAction<ResourceIdentifier, ResourceBody>>
  >()

  // State: Hook Key
  const [hookKey] = useState(generateUuid())

  // Request Promise Controller
  const requestPromiseController = useRequestPromiseController<
    ResourceIdentifier,
    ResourceBody
  >()

  /*********************************/
  /*******  CRUD Resolution  *******/
  /*********************************/

  // Deconstruct: Request promise controller
  const {
    createPromiseResolverList,
    readPromiseResolverList,
    updatePromiseResolverList,
    deletePromiseResolverList,
    removeCreatePromiseResolver,
    removeReadPromiseResolver,
    removeUpdatePromiseResolver,
    removeDeletePromiseResolver,
  } = requestPromiseController

  // Deconstruct: Request results from state
  const { receivedResults: requestResultList } = state

  // Memo: Next request result belonging to this hook in the queue
  const matchedRequestResult = useMemo(
    () =>
      requestResultList.find(
        (receivedResult) => receivedResult.hookKey === hookKey
      ) ?? null,
    [hookKey, requestResultList]
  )

  // Memo: Matching resolver for create request result
  const matchedCreateResolver = useMemo(
    () =>
      matchedRequestResult
        ? createPromiseResolverList.find(
            (resolver) =>
              resolver.requestKey === matchedRequestResult.requestKey
          ) ?? null
        : null,
    [createPromiseResolverList, matchedRequestResult]
  )

  // Memo: Matching resolver for read request result
  const matchedReadResolver = useMemo(
    () =>
      matchedRequestResult
        ? readPromiseResolverList.find(
            (resolver) =>
              resolver.requestKey === matchedRequestResult.requestKey
          ) ?? null
        : null,
    [readPromiseResolverList, matchedRequestResult]
  )

  // Memo: Matching resolver for read request result
  const matchedUpdateResolver = useMemo(
    () =>
      matchedRequestResult
        ? updatePromiseResolverList.find(
            (resolver) =>
              resolver.requestKey === matchedRequestResult.requestKey
          ) ?? null
        : null,
    [updatePromiseResolverList, matchedRequestResult]
  )

  // Memo: Matching resolver for read request result
  const matchedDeleteResolver = useMemo(
    () =>
      matchedRequestResult
        ? deletePromiseResolverList.find(
            (resolver) =>
              resolver.requestKey === matchedRequestResult.requestKey
          ) ?? null
        : null,
    [deletePromiseResolverList, matchedRequestResult]
  )

  // Callback: Resolve next operation result promise in queue
  const resolveQueuedOperation = useCallback(() => {
    // Fail Fast: Do nothing if no matched request found
    if (matchedRequestResult === null) {
      return
    }

    // Deconstruct: Matched request result
    const {
      requestKey: matchedRequestKey,
      method: matchedRequestMethod,
      status: matchedRequestResultStatus,
      message: matchedRequestResultMessage,
    } = matchedRequestResult

    // Switch: Matched request method
    switch (matchedRequestMethod) {
      // Case: POST request
      case 'post': {
        // Deconstruct: Match request result
        const { payload: matchedRequestResultPayload } = matchedRequestResult

        // Operation: Take create promise resolver
        const createPromiseResolver = matchedCreateResolver

        // Throw: If resolver not found
        if (!createPromiseResolver) {
          const errorMessage = `R3G: Could not find 'create' promise resolver for request result.`
          console.error(errorMessage, {
            hookKey,
            requestKey: matchedRequestKey,
          })
          throw new Error(errorMessage)
        }

        // Deconstruct: Resolver
        const { resolve: resolveCreatePromise } = createPromiseResolver

        // Construct: Operation result
        const createOperationResult: R3gCreateOperationResult<ResourceIdentifier> = {
          status: matchedRequestResultStatus,
          message: matchedRequestResultMessage,
          payload: matchedRequestResultPayload,
        }

        // Callback: Resolve promise
        resolveCreatePromise(createOperationResult)

        // Callback: Remove resolver
        removeCreatePromiseResolver(matchedRequestKey)

        break
      }
      // Case: GET request
      case 'get': {
        // Deconstruct: Match request result
        const { payload: matchedRequestResultPayload } = matchedRequestResult

        // Operation: Take create promise resolver
        const readPromiseResolver = matchedReadResolver

        // Throw: If resolver not found
        if (!readPromiseResolver) {
          const errorMessage = `R3G: Could not find 'read' promise resolver for request result.`
          console.error(errorMessage, {
            hookKey,
            requestKey: matchedRequestKey,
          })
          throw new Error(errorMessage)
        }

        // Deconstruct: Resolver
        const { resolve: resolveReadPromise } = readPromiseResolver

        // Construct: Operation result
        const readOperationResult: R3gReadOperationResult<
          ResourceIdentifier,
          ResourceBody
        > = {
          status: matchedRequestResultStatus,
          message: matchedRequestResultMessage,
          payload: matchedRequestResultPayload,
        }

        // Callback: Resolve promise
        resolveReadPromise(readOperationResult)

        // Callback: Remove resolver
        removeReadPromiseResolver(matchedRequestKey)

        break
      }
      // Case: PUT request
      case 'put': {
        // Deconstruct: Match request result
        const { payload: matchedRequestResultPayload } = matchedRequestResult

        // Operation: Take create promise resolver
        const updatePromiseResolver = matchedUpdateResolver

        // Throw: If resolver not found
        if (!updatePromiseResolver) {
          const errorMessage = `R3G: Could not find 'update' promise resolver for request result.`
          console.error(errorMessage, {
            hookKey,
            requestKey: matchedRequestKey,
          })
          throw new Error(errorMessage)
        }

        // Deconstruct: Resolver
        const { resolve: resolveUpdatePromise } = updatePromiseResolver

        // Construct: Operation result
        const updateOperationResult: R3gUpdateOperationResult = {
          status: matchedRequestResultStatus,
          message: matchedRequestResultMessage,
          payload: matchedRequestResultPayload,
        }

        // Callback: Resolve promise
        resolveUpdatePromise(updateOperationResult)

        // Callback: Remove resolver
        removeUpdatePromiseResolver(matchedRequestKey)
      }
      // Case: DELETE request
      case 'delete': {
        // Deconstruct: Match request result
        const { payload: matchedRequestResultPayload } = matchedRequestResult

        // Operation: Take create promise resolver
        const deletePromiseResolver = matchedDeleteResolver

        // Throw: If resolver not found
        if (!deletePromiseResolver) {
          const errorMessage = `R3G: Could not find 'delete' promise resolver for request result.`
          console.error(errorMessage, {
            hookKey,
            requestKey: matchedRequestKey,
          })
          throw new Error(errorMessage)
        }

        // Deconstruct: Resolver
        const { resolve: resolveDeletePromise } = deletePromiseResolver

        // Construct: Operation result
        const deleteOperationResult: R3gDeleteOperationResult = {
          status: matchedRequestResultStatus,
          message: matchedRequestResultMessage,
          payload: matchedRequestResultPayload,
        }

        // Callback: Resolve promise
        resolveDeletePromise(deleteOperationResult)

        // Callback: Remove resolver
        removeDeletePromiseResolver(matchedRequestKey)
      }
      // Unrecognized Method
      default: {
        throw new Error(
          `R3G: Cannot resolve REST operation promise. ` +
            `Unrecognized request method '${matchedRequestMethod}'.`
        )
      }
    }

    // Dispatch: Resolve request
    const resolveAction = creators.resolve(matchedRequestKey)
    dispatch(resolveAction)
  }, [
    creators,
    dispatch,
    hookKey,
    matchedCreateResolver,
    matchedDeleteResolver,
    matchedReadResolver,
    matchedRequestResult,
    matchedUpdateResolver,
    removeCreatePromiseResolver,
    removeDeletePromiseResolver,
    removeReadPromiseResolver,
    removeUpdatePromiseResolver,
  ])

  // Effect: Observe received results & resolve promises
  useEffect(() => {
    // Fail Fast: Do nothing if no matched request found
    if (matchedRequestResult === null) {
      return
    }

    resolveQueuedOperation()
  }, [matchedRequestResult, resolveQueuedOperation])

  /*********************************/
  /**********  Clean Up  ***********/
  /*********************************/

  // Callback: Reject all queued promises and cancel all queued requests
  const clearPromisesAndRequests = useCallback(() => {
    // Reject promise resolvers
    const resolverList = [
      ...createPromiseResolverList,
      ...readPromiseResolverList,
      ...updatePromiseResolverList,
      ...deletePromiseResolverList,
    ]
    resolverList.forEach((resolver) => {
      const { requestKey: requestKey, reject } = resolver
      reject(
        `R3G: ${resourceConfig.name} - Hook ${hookKey} dismounted before request ${requestKey} could be handled.`
      )
    })

    // Remove requests from queue
    const requestKeyList = resolverList.map((resolver) => resolver.requestKey)
    requestKeyList.forEach((requestKey) => {
      const cancelAction = creators.cancelRequest(requestKey)
      dispatch(cancelAction)
    })
  }, [
    createPromiseResolverList,
    creators,
    deletePromiseResolverList,
    dispatch,
    hookKey,
    readPromiseResolverList,
    resourceConfig.name,
    updatePromiseResolverList,
  ])

  // Effect: Clear promises and requests when hook dismounts
  useEffect(() => {
    return () => {
      clearPromisesAndRequests()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /*********************************/
  /*********  Request Flags ********/
  /*********************************/

  // Deconstruct: State
  const { fetching, method, status, message } = state

  // Callback: Clear response
  const clearResponse = useCallback(() => {
    const action = creators.clearResponse()
    dispatch(action)
  }, [creators, dispatch])

  /*********************************/
  /********  CRUD Operations *******/
  /*********************************/

  // Deconstruct: Request promise controller
  const {
    putCreatePromiseResolver,
    putReadPromiseResolver,
    putUpdatePromiseResolver,
    putDeletePromiseResolver,
  } = requestPromiseController

  // Callback: 'Create' Operation
  const create = useCallback(
    async (
      parentsIdentifier?: Record<string, string>,
      overrideData?: ResourceBody
    ) => {
      // Ensure parentsIdentifier supplied if needed
      if (resourceConfig.identifiers.length > 1 && !parentsIdentifier) {
        throw new Error(
          `Expected parents identifier for resource that has parents. [${resourceConfig.name}]`
        )
      }

      // Generate key for queued request
      const requestKey = generateUuid()

      // Register request promise
      const requestPromise = new Promise<
        R3gCreateOperationResult<ResourceIdentifier>
      >((resolve, reject) => {
        const promiseResolver: R3gCreatePromiseResolver<ResourceIdentifier> = {
          requestKey,
          resolve,
          reject,
        }
        putCreatePromiseResolver(promiseResolver)
      })

      // Prepare POST request information
      const url = R3gRequestFunctions.getApiUrlSingleAnon<
        ResourceIdentifier,
        ResourceBody,
        ReadParams
      >({
        parentsIdentifier: parentsIdentifier ?? {},
        resourceConfig,
      })
      const data = overrideData ? overrideData : { ...state.fields }
      const body = JSON.stringify(data)

      // Queue request
      const queueAction = creators.queueRequest(
        requestKey,
        hookKey,
        'post',
        url,
        body
      )
      dispatch(queueAction)

      // Return request promise
      return requestPromise
    },
    [
      creators,
      dispatch,
      hookKey,
      putCreatePromiseResolver,
      resourceConfig,
      state.fields,
    ]
  )

  // Callback: 'Read' Operation
  const read = useCallback(
    async (params?: ReadParams) => {
      // Generate key for queued request
      const requestKey = generateUuid()

      // Register request promise
      const requestPromise = new Promise<
        R3gReadOperationResult<ResourceIdentifier, ResourceBody>
      >((resolve, reject) => {
        const promiseResolver: R3gReadPromiseResolver<
          ResourceIdentifier,
          ResourceBody
        > = {
          requestKey,
          resolve,
          reject,
        }
        putReadPromiseResolver(promiseResolver)
      })

      // Prepare GET request information
      const url = R3gRequestFunctions.getApiUrlMany<
        ResourceIdentifier,
        ResourceBody,
        ReadParams
      >({ resourceConfig, readParams: params ?? ({} as ReadParams) })

      // Queue request
      const queueAction = creators.queueRequest(
        requestKey,
        hookKey,
        'get',
        url,
        null
      )
      dispatch(queueAction)

      // Return request promise
      return requestPromise
    },
    [creators, dispatch, hookKey, putReadPromiseResolver, resourceConfig]
  )

  // Callback: 'Read' Operation
  const update = useCallback(
    async (
      resourceIdentifier: ResourceIdentifier,
      overrideData?: ResourceBody
    ) => {
      // Generate key for queued request
      const requestKey = generateUuid()

      // Register request promise
      const requestPromise = new Promise<R3gUpdateOperationResult>(
        (resolve, reject) => {
          const promiseResolver: R3gUpdatePromiseResolver = {
            requestKey,
            resolve,
            reject,
          }
          putUpdatePromiseResolver(promiseResolver)
        }
      )

      // Prepare PUT request information
      const url = R3gRequestFunctions.getApiUrlSingle<
        ResourceIdentifier,
        ResourceBody,
        ReadParams
      >({ resourceIdentifier: resourceIdentifier, resourceConfig })
      const data = overrideData ? overrideData : { ...state.fields }
      const body = JSON.stringify(data)

      // Queue request
      const queueAction = creators.queueRequest(
        requestKey,
        hookKey,
        'put',
        url,
        body
      )
      dispatch(queueAction)

      // Return request promise
      return requestPromise
    },
    [
      creators,
      dispatch,
      hookKey,
      putUpdatePromiseResolver,
      resourceConfig,
      state.fields,
    ]
  )

  // Callback: 'Delete' Operation
  const _delete = useCallback(
    async (resourceIdentifier: ResourceIdentifier) => {
      // Generate key for queued request
      const requestKey = generateUuid()

      // Register request promise
      const requestPromise = new Promise<R3gDeleteOperationResult>(
        (resolve, reject) => {
          const promiseResolver: R3gDeletePromiseResolver = {
            requestKey,
            resolve,
            reject,
          }
          putDeletePromiseResolver(promiseResolver)
        }
      )

      // Prepare DELETE request information
      const url = R3gRequestFunctions.getApiUrlSingle<
        ResourceIdentifier,
        ResourceBody,
        ReadParams
      >({
        resourceIdentifier: resourceIdentifier,
        resourceConfig,
      })

      // Queue request
      const queueAction = creators.queueRequest(
        requestKey,
        hookKey,
        'delete',
        url,
        null
      )
      dispatch(queueAction)

      // Return request promise
      return requestPromise
    },
    [creators, dispatch, hookKey, putDeletePromiseResolver, resourceConfig]
  )

  /*********************************/
  /******** Form Callbacks *********/
  /*********************************/

  // Deconstruct: State
  const { fields } = state

  // Callback: Get field
  const getField = useCallback((name: keyof ResourceBody) => fields[name], [
    fields,
  ])

  // Callback: Set field
  const setField = useCallback(
    (name: keyof ResourceBody, value: unknown) => {
      const action = creators.setField(name, value)
      dispatch(action)
    },
    [creators, dispatch]
  )

  // Callback: Clear fields
  const clearFields = useCallback(() => {
    const action = creators.clearFields()
    dispatch(action)
  }, [creators, dispatch])

  /*********************************/
  /******** Cache Callbacks ********/
  /*********************************/

  // Deconstruct: Resource config
  const {
    identifiers: resourceIdentifierKeys,
    filter: filterResource,
    sort: sortResource,
    postProcess: postProcessResourceList,
  } = resourceConfig

  // Deconstruct: State
  const { resourceList } = state

  // Callback: Get list of resources
  const getMany = useCallback(
    (params?: ReadParams) =>
      (postProcessResourceList ?? ((resourceList) => resourceList))(
        resourceList
          .filter((resource, index) =>
            (filterResource ?? (() => true))(resource, params ?? {}, index)
          )
          .sort((resourceA, resourceB) =>
            (sortResource ?? (() => 0))(resourceA, resourceB, params ?? {})
          ),
        params ?? {}
      ),
    [filterResource, postProcessResourceList, resourceList, sortResource]
  )

  // Callback: Get single resource instance
  const getOne = useCallback(
    (resourceIdentifier: ResourceIdentifier) =>
      resourceList.find((resource) => {
        const doIdentifiersMatch = resourceIdentifierKeys
          .map(
            (identifierKey) =>
              resourceIdentifier[identifierKey] === resource[identifierKey]
          )
          .reduce(
            (doAllPreviousMatch, doesCurrentMatch) =>
              doAllPreviousMatch && doesCurrentMatch,
            true
          )
        return doIdentifiersMatch
      }) ?? null,
    [resourceIdentifierKeys, resourceList]
  )

  // Callback: Invalidate resource cache
  const invalidate = useCallback(() => {
    const action = creators.invalidate()
    dispatch(action)
  }, [creators, dispatch])

  /*********************************/
  /************ Return *************/
  /*********************************/

  // Return: Request Controller
  return {
    fetching,
    method,
    status,
    message,
    clearResponse,
    create,
    read,
    update,
    delete: _delete,
    getField,
    setField,
    clearFields,
    getMany,
    getOne,
    invalidate,
  }
}

export default useRequestController
