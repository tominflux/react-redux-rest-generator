import generateRestInterface from './generateRestInterface'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import flattenPrimitiveObjectArray from '../../utils/flattenObjectArray'
import axios, { AxiosError } from 'axios'
import generateUuid from '../../utils/generateUuid'
import concatPrimitivesToString from '../../utils/concatMisc'
import {
  RestHookGenerator,
  RestReduxCreatorSet,
  RestResourceConfig,
  RestHook,
  RestReduxState,
  RestCreatePromiseResolver,
  RestReadPromiseResolver,
  RestUpdatePromiseResolver,
  RestDeletePromiseResolver,
  RestPrimitive,
  RestRequest,
} from '../../types'

const generateRestHook: RestHookGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  creators: RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>,
  resourceConfig: RestResourceConfig<AnonResourceType, ReadParamsType>
) => {
  const useRestResource: RestHook<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  > = (paramsList?: Array<ReadParamsType>, readExplicitly?: boolean) => {
    // Redux
    const stateName = resourceConfig.stateName ?? `${resourceConfig.name}State`
    const state = useSelector<
      Record<string | number | symbol, unknown>,
      RestReduxState<CompositeIdentifierType, AnonResourceType>
    >(
      (state) =>
        state[stateName] as RestReduxState<
          CompositeIdentifierType,
          AnonResourceType
        >
    )
    const dispatch = useDispatch()
    // - Sub-selections
    const { fetching, pendingRequests } = state

    // State (local)
    // - Hook Key (for logging/debugging)
    const [hookKey] = useState(generateUuid())
    // - Request promise resolvers
    const [createPromiseResolverList, setCreatePromiseResolverList] = useState<
      Array<RestCreatePromiseResolver<CompositeIdentifierType>>
    >([])
    const [readPromiseResolverList, setReadPromiseResolverList] = useState<
      Array<RestReadPromiseResolver<AnonResourceType>>
    >([])
    const [updatePromiseResolverList, setUpdatePromiseResolverList] = useState<
      Array<RestUpdatePromiseResolver>
    >([])
    const [deletePromiseResolverList, setDeletePromiseResolverList] = useState<
      Array<RestDeletePromiseResolver>
    >([])

    // Request promise controllers
    // - General
    const putRequestPromiseResolver = (
      resolver: unknown,
      setResolverList: React.Dispatch<React.SetStateAction<Array<unknown>>>
    ) => {
      // Add resolver to list.
      setResolverList((prevResolverList) => [...prevResolverList, resolver])
    }
    const takeRequestPromiseResolver = (
      key: string,
      resolverList: Array<unknown>,
      setResolverList: React.Dispatch<React.SetStateAction<Array<unknown>>>
    ) => {
      // Find resolver with specified key in list.
      const resolver =
        resolverList.find((promiseResolver) => {
          const keyedResolver = promiseResolver as Record<string, unknown> & {
            key: string
          }
          const isMatch = keyedResolver.key === key
          return isMatch
        }) ?? null
      if (resolver === null) return null

      // Remove resolver with specified key from list.
      setResolverList((prevResolverList) =>
        prevResolverList.filter((promiseResolver) => {
          const keyedResolver = promiseResolver as Record<string, unknown> & {
            key: string
          }
          const isMatch = keyedResolver.key === key
          return !isMatch
        })
      )

      // Return resolver with specified key in list.
      return resolver
    }
    // - Create
    const putCreatePromiseResolver = (
      resolver: RestCreatePromiseResolver<CompositeIdentifierType>
    ) =>
      putRequestPromiseResolver(
        resolver,
        setCreatePromiseResolverList as React.Dispatch<
          React.SetStateAction<Array<unknown>>
        >
      )
    const takeCreatePromiseResolver = (key: string) =>
      takeRequestPromiseResolver(
        key,
        createPromiseResolverList,
        setCreatePromiseResolverList as React.Dispatch<
          React.SetStateAction<Array<unknown>>
        >
      ) as RestCreatePromiseResolver<CompositeIdentifierType>
    // - Read
    const putReadPromiseResolver = (
      resolver: RestReadPromiseResolver<AnonResourceType>
    ) =>
      putRequestPromiseResolver(
        resolver,
        setReadPromiseResolverList as React.Dispatch<
          React.SetStateAction<Array<unknown>>
        >
      )
    const takeReadPromiseResolver = (key: string) =>
      takeRequestPromiseResolver(
        key,
        readPromiseResolverList,
        setReadPromiseResolverList as React.Dispatch<
          React.SetStateAction<Array<unknown>>
        >
      ) as RestReadPromiseResolver<AnonResourceType>
    // - Update
    const putUpdatePromiseResolver = (resolver: RestUpdatePromiseResolver) =>
      putRequestPromiseResolver(
        resolver,
        setUpdatePromiseResolverList as React.Dispatch<
          React.SetStateAction<Array<unknown>>
        >
      )
    const takeUpdatePromiseResolver = (key: string) =>
      takeRequestPromiseResolver(
        key,
        updatePromiseResolverList,
        setUpdatePromiseResolverList as React.Dispatch<
          React.SetStateAction<Array<unknown>>
        >
      ) as RestUpdatePromiseResolver
    // - Delete
    const putDeletePromiseResolver = (resolver: RestDeletePromiseResolver) =>
      putRequestPromiseResolver(
        resolver,
        setDeletePromiseResolverList as React.Dispatch<
          React.SetStateAction<Array<unknown>>
        >
      )
    const takeDeletePromiseResolver = (key: string) =>
      takeRequestPromiseResolver(
        key,
        deletePromiseResolverList,
        setDeletePromiseResolverList as React.Dispatch<
          React.SetStateAction<Array<unknown>>
        >
      ) as RestDeletePromiseResolver

    // Interface (methods and flags)
    const _interface = generateRestInterface(
      state,
      dispatch,
      creators as RestReduxCreatorSet<
        CompositeIdentifierType,
        AnonResourceType
      >,
      resourceConfig,
      putCreatePromiseResolver,
      putReadPromiseResolver,
      putUpdatePromiseResolver,
      putDeletePromiseResolver
    )

    // Effects
    // - Fetch resources specified in params list
    const getParamsListDep: () => string | null = () => {
      const paramsListNullish = (paramsList ?? null) === null
      if (paramsListNullish) return null
      const flatParams: Array<RestPrimitive> = flattenPrimitiveObjectArray(
        (paramsList as Array<unknown>) as Array<Record<string, RestPrimitive>>
      )
      const depString = concatPrimitivesToString(flatParams)
      return depString
    }
    useEffect(() => {
      if (!paramsList) return

      paramsList.forEach((params) => {
        _interface.read(params)
      })
    }, [getParamsListDep(), state.invalidationIndex])
    // - Process request queue
    useEffect(() => {
      if (fetching) return

      const processNextRequest = async () => {
        // Ensure request queue is not empty
        if (pendingRequests.length === 0) return

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
            | RestReadPromiseResolver<AnonResourceType>
            | RestUpdatePromiseResolver
            | RestDeletePromiseResolver
        } | null = (index = 0) => {
          if (index >= pendingRequests.length) return null
          const request = pendingRequests[index]
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
            console.log('R3G - Could not find matched request', {
              hook: hookKey,
            })
          }
          return
        }
        const { request, resolver } = requestAndResolver

        // Determine if request belongs to this hook.
        if (resourceConfig.verboseLogging) {
          console.log('R3G - Processing Request', {
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
          const message = response.data.message
          const payload = response.data.payload

          // Dispatch response action & resolve promise
          switch (method) {
            case 'post': {
              const compositeIdentifier = payload

              // Inform reducer of create response
              const responseAction = creators.response(status, message, {
                compositeIdentifier,
              })
              dispatch(responseAction)

              // Resolve promise
              const createPromiseResolver = resolver as RestCreatePromiseResolver<CompositeIdentifierType>
              createPromiseResolver.resolve({
                status,
                message,
                compositeIdentifier,
              })

              if (resourceConfig.verboseLogging)
                console.log('R3G - Request Resolved | ', 'Success', {
                  hook: hookKey,
                  ...request,
                })
              break
            }
            case 'get': {
              const listName =
                resourceConfig.apiPayloadResourceListName ??
                `${resourceConfig.name}List`
              const { [listName]: resourceList } = payload

              // Inform reducer of read response
              const responseAction = creators.response(status, message, {
                resourceList,
              })
              dispatch(responseAction)

              // Resolve promise
              const readPromiseResolver = resolver as RestReadPromiseResolver<AnonResourceType>
              readPromiseResolver.resolve({
                status,
                message,
                resourceList,
              })

              if (resourceConfig.verboseLogging)
                console.log('R3G - Request Resolved | ', 'Success', {
                  hook: hookKey,
                  ...request,
                })
              break
            }
            case 'put':
            case 'delete': {
              // Inform reducer of update or delete response
              const responseAction = creators.response(status, message, null)
              dispatch(responseAction)

              // Resolve promise
              const putOrDeleteResolver = resolver as
                | RestUpdatePromiseResolver
                | RestDeletePromiseResolver
              putOrDeleteResolver.resolve({
                status,
                message,
              })

              if (resourceConfig.verboseLogging)
                console.log('R3G - Request Resolved | ', 'Success', {
                  hook: hookKey,
                  ...request,
                })
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
            case 'post': {
              // Inform reducer that new resource failed to be created
              const responseAction = creators.response(status, message, {})
              dispatch(responseAction)

              // Resolve promise
              const createPromiseResolver = resolver as RestCreatePromiseResolver<CompositeIdentifierType>
              createPromiseResolver.resolve({
                status,
                message,
                compositeIdentifier: null,
              })

              if (resourceConfig.verboseLogging)
                console.log('R3G - Request Resolved | ', 'Error', {
                  hook: hookKey,
                  ...request,
                })
              break
            }
            case 'get': {
              // Inform reducer that resourceList failed to be read
              const responseAction = creators.response(status, message, {
                resourceList: [],
              })
              dispatch(responseAction)

              // Resolve promise
              const readPromiseResolver = resolver as RestReadPromiseResolver<AnonResourceType>
              readPromiseResolver.resolve({
                status,
                message,
                resourceList: [],
              })

              if (resourceConfig.verboseLogging)
                console.log('R3G - Request Resolved | ', 'Error', {
                  hook: hookKey,
                  ...request,
                })
              break
            }
            case 'put':
            case 'delete': {
              // Inform reducer that update/delete operation failed
              const responseAction = creators.response(status, message, null)
              dispatch(responseAction)

              // Resolve promise
              const promiseResolver = resolver as
                | RestUpdatePromiseResolver
                | RestDeletePromiseResolver
              promiseResolver.resolve({
                status,
                message,
              })

              if (resourceConfig.verboseLogging)
                console.log('R3G - Request Resolved | ', 'Error', {
                  hook: hookKey,
                  ...request,
                })
              break
            }
          }
        }
      }

      processNextRequest()
    }, [
      fetching,
      pendingRequests
        .map((request) => request.key)
        .reduce((accumulator, current) => `${accumulator}-${current}`, ''),
    ])
    // - Clean up on dismount
    useEffect(() => {
      return () => {
        if (resourceConfig.verboseLogging) {
          console.log('R3G - Hook dismounting', { hook: hookKey })
        }

        const resolverList = [
          ...createPromiseResolverList,
          ...readPromiseResolverList,
          ...updatePromiseResolverList,
          ...deletePromiseResolverList,
        ]

        // Reject promise resolvers
        resolverList.forEach((resolver) => {
          const { key: requestKey, reject } = resolver
          reject(
            `R3G hook ${hookKey} dismounted before request ${requestKey} could be handled.`
          )
        })

        // Remove requests from queue
        const requestKeyList = resolverList.map((resolver) => resolver.key)
        requestKeyList.forEach((requestKey) => {
          const cancelAction = creators.cancelRequest(requestKey)
          dispatch(cancelAction)
        })
      }
    }, [])

    return _interface
  }

  return useRestResource
}

export default generateRestHook
