import generateRestInterface from './generateRestInterface'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import flattenObjectArray from '../../utils/flattenObjectArray'
import axios from 'axios'
import generateUuid from '../../utils/generateUuid'

/*
<
    CompositeIdentifierType extends Record<string, unknown>,
    AnonResourceType extends Record<string, unknown>,
    ReadParamsType extends Record<string, unknown>
>
*/

const generateRestHook: (
  creators: RestReduxCreatorSet,
  resourceConfig: RestResourceConfig
) => RestHook = (creators, resourceConfig) => {
  const useRestResource: RestHook = (paramsList) => {
    // Redux
    const stateName = resourceConfig.stateName ?? `${resourceConfig.name}State`
    const state = useSelector<
      Record<string | number | symbol, unknown>,
      RestReduxState
    >((state) => state[stateName] as RestReduxState)
    const dispatch = useDispatch()
    // - Sub-selections
    const { fetching, pendingRequests } = state

    // State (local)
    // - Hook Key (for logging/debugging)
    const [hookKey] = useState(generateUuid())
    // - Request promise resolvers
    const [createPromiseResolverList, setCreatePromiseResolverList] = useState<
      Array<RestCreatePromiseResolver>
    >([])
    const [readPromiseResolverList, setReadPromiseResolverList] = useState<
      Array<RestReadPromiseResolver>
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
    const putCreatePromiseResolver = (resolver: RestCreatePromiseResolver) =>
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
      ) as RestCreatePromiseResolver
    // - Read
    const putReadPromiseResolver = (resolver: RestReadPromiseResolver) =>
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
      ) as RestReadPromiseResolver
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
      creators as RestReduxCreatorSet,
      resourceConfig,
      putCreatePromiseResolver,
      putReadPromiseResolver,
      putUpdatePromiseResolver,
      putDeletePromiseResolver
    )

    // Effects
    // - Fetch resources specified in params list
    useEffect(() => {
      if (!paramsList) return

      paramsList.forEach((params) => {
        _interface.read(params)
      })
    }, [...flattenObjectArray(paramsList ?? []), state.invalidationIndex])
    // - Process request queue
    useEffect(() => {
      if (fetching) return

      const processNextRequest = async () => {
        // Ensure request queue is not empty
        if (pendingRequests.length === 0) return

        // Get next pending request
        const request = pendingRequests.slice(0, 1)[0]
        const { key, method, url, body } = request

        // Get the request promise resolver
        const resolverTakers = {
          post: takeCreatePromiseResolver,
          get: takeReadPromiseResolver,
          put: takeUpdatePromiseResolver,
          delete: takeDeletePromiseResolver,
        }
        const requestPromiseResolver = resolverTakers[method](key)

        // Determine if request belongs to this hook.
        const shouldHandle = requestPromiseResolver !== null
        if (resourceConfig.verboseLogging) {
          const resolverKeyLists = {
            post: createPromiseResolverList,
            get: readPromiseResolverList,
            put: updatePromiseResolverList,
            delete: deletePromiseResolverList,
          }
          const resolverKeys = resolverKeyLists[method]
          console.log(
            'R3G - Found Request | ',
            shouldHandle ? 'Processing...' : 'Skipping.',
            request,
            {
              hook: hookKey,
              key,
              resolverKeys,
            }
          )
        }

        // If does not belong, skip.
        if (!shouldHandle) {
          return
        }

        // There is a potential that some requests get stuck
        // because the hook they belong to no longer exists.

        // Inform reducer that request is being handled
        const fetchAction = creators.fetch(key)
        dispatch(fetchAction)

        // Attempt to contact API and run operation
        try {
          // Send request to API
          const response = await axios.request({
            method,
            url,
            data: body,
            headers: { 'Content-Type': 'application/json' },
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
              const createPromiseResolver = requestPromiseResolver as RestCreatePromiseResolver
              createPromiseResolver.resolve({
                status,
                message,
                compositeIdentifier,
              })

              if (resourceConfig.verboseLogging)
                console.log('R3G - Request Resolved | ', 'Success', request, {
                  hook: hookKey,
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
              const readPromiseResolver = requestPromiseResolver as RestReadPromiseResolver
              readPromiseResolver.resolve({
                status,
                message,
                resourceList,
              })

              if (resourceConfig.verboseLogging)
                console.log('R3G - Request Resolved | ', 'Success', request, {
                  hook: hookKey,
                })
              break
            }
            case 'put':
            case 'delete': {
              // Inform reducer of update or delete response
              const responseAction = creators.response(status, message, null)
              dispatch(responseAction)

              // Resolve promise
              const resolver = requestPromiseResolver as
                | RestUpdatePromiseResolver
                | RestDeletePromiseResolver
              resolver.resolve({
                status,
                message,
              })

              if (resourceConfig.verboseLogging)
                console.log('R3G - Request Resolved | ', 'Success', request, {
                  hook: hookKey,
                })
              break
            }
          }
        } catch (err) {
          // Throw error again if not recognizable API error
          if (!err.response) {
            console.error('Processing R3G request failed for unknown reason.')
            throw err
          }

          // Extract information from API response
          const status = err.response.status
          const message = err.response.data.message

          // Log both axios error message and API error message
          console.error(err.message)
          console.error(message)

          // Dispatch response action & resolve promise
          switch (method) {
            case 'post': {
              // Inform reducer that new resource failed to be created
              const responseAction = creators.response(status, message, {})
              dispatch(responseAction)

              // Resolve promise
              const createPromiseResolver = requestPromiseResolver as RestCreatePromiseResolver
              createPromiseResolver.resolve({
                status,
                message,
                compositeIdentifier: null,
              })

              if (resourceConfig.verboseLogging)
                console.log('R3G - Request Resolved | ', 'Error', request, {
                  hook: hookKey,
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
              const readPromiseResolver = requestPromiseResolver as RestReadPromiseResolver
              readPromiseResolver.resolve({
                status,
                message,
                resourceList: [],
              })

              if (resourceConfig.verboseLogging)
                console.log('R3G - Request Resolved | ', 'Error', request, {
                  hook: hookKey,
                })
              break
            }
            case 'put':
            case 'delete': {
              // Inform reducer that update/delete operation failed
              const responseAction = creators.response(status, message, null)
              dispatch(responseAction)

              // Resolve promise
              const promiseResolver = requestPromiseResolver as
                | RestUpdatePromiseResolver
                | RestDeletePromiseResolver
              promiseResolver.resolve({
                status,
                message,
              })

              if (resourceConfig.verboseLogging)
                console.log('R3G - Request Resolved | ', 'Error', request, {
                  hook: hookKey,
                })
              break
            }
          }
        }
      }

      processNextRequest()

      // return () => {}
    }, [
      fetching,
      pendingRequests
        .map((request) => request.key)
        .reduce((accumulator, current) => `${accumulator}-${current}`, ''),
    ])

    return _interface
  }

  return useRestResource
}

export default generateRestHook
