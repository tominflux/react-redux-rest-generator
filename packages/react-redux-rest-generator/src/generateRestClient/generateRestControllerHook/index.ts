import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from 'redux'
import generateUuid from '../../utils/generateUuid'
import generateRestInterface from './generateRestInterface'
import { RestReduxCreatorSet } from '../generateRestRedux/generateRestCreators/types'
import {
  RestCreatePayload,
  RestReadPayload,
  RestReduxState,
} from '../generateRestRedux/types'
import { RestResourceConfig } from '../types'
import {
  RestControllerHook,
  RestControllerHookContext,
  RestControllerHookGenerator,
  RestCreatePromiseResolver,
  RestCreateResult,
  RestDeletePromiseResolver,
  RestDeleteResult,
  RestReadPromiseResolver,
  RestReadResult,
  RestUpdatePromiseResolver,
  RestUpdateResult,
} from './types'
import handleControllerHookDismount from './events/handleControllerHookDismount'

const generateControllerHook: RestControllerHookGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  creators: RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>,
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => {
  const useRestResource: RestControllerHook<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  > = () => {
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
    const dispatch: Dispatch = useDispatch()

    // State (local)
    // - Hook Key (for logging/debugging)
    const [hookKey] = useState(generateUuid())
    // - Request promise resolvers
    const [createPromiseResolverList, setCreatePromiseResolverList] = useState<
      Array<RestCreatePromiseResolver<CompositeIdentifierType>>
    >([])
    const [readPromiseResolverList, setReadPromiseResolverList] = useState<
      Array<RestReadPromiseResolver<CompositeIdentifierType, AnonResourceType>>
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
      requestKey: string,
      resolverList: Array<unknown>,
      setResolverList: React.Dispatch<React.SetStateAction<Array<unknown>>>
    ) => {
      // Find resolver with specified key in list.
      const resolver =
        resolverList.find((promiseResolver) => {
          const keyedResolver = promiseResolver as Record<string, unknown> & {
            requestKey: string
          }
          const isMatch = keyedResolver.requestKey === requestKey
          return isMatch
        }) ?? null
      if (resolver === null) return null

      // Remove resolver with specified key from list.
      setResolverList((prevResolverList) =>
        prevResolverList.filter((promiseResolver) => {
          const keyedResolver = promiseResolver as Record<string, unknown> & {
            requestKey: string
          }
          const isMatch = keyedResolver.requestKey === requestKey
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
    const takeCreatePromiseResolver = (requestKey: string) =>
      takeRequestPromiseResolver(
        requestKey,
        createPromiseResolverList,
        setCreatePromiseResolverList as React.Dispatch<
          React.SetStateAction<Array<unknown>>
        >
      ) as RestCreatePromiseResolver<CompositeIdentifierType>
    // - Read
    const putReadPromiseResolver = (
      resolver: RestReadPromiseResolver<
        CompositeIdentifierType,
        AnonResourceType
      >
    ) =>
      putRequestPromiseResolver(
        resolver,
        setReadPromiseResolverList as React.Dispatch<
          React.SetStateAction<Array<unknown>>
        >
      )
    const takeReadPromiseResolver = (requestKey: string) =>
      takeRequestPromiseResolver(
        requestKey,
        readPromiseResolverList,
        setReadPromiseResolverList as React.Dispatch<
          React.SetStateAction<Array<unknown>>
        >
      ) as RestReadPromiseResolver<CompositeIdentifierType, AnonResourceType>
    // - Update
    const putUpdatePromiseResolver = (resolver: RestUpdatePromiseResolver) =>
      putRequestPromiseResolver(
        resolver,
        setUpdatePromiseResolverList as React.Dispatch<
          React.SetStateAction<Array<unknown>>
        >
      )
    const takeUpdatePromiseResolver = (requestKey: string) =>
      takeRequestPromiseResolver(
        requestKey,
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

    // Construct hook context
    const controllerHookContext: RestControllerHookContext<
      CompositeIdentifierType,
      AnonResourceType,
      ReadParamsType
    > = {
      // Config
      resourceConfig,
      // Redux
      state,
      creators,
      dispatch,
      // Hook Info
      hookKey,
      // Promise Resolver Lists
      createPromiseResolverList,
      readPromiseResolverList,
      updatePromiseResolverList,
      deletePromiseResolverList,
      // Promise Resolver Actions
      // - Create
      putCreatePromiseResolver,
      takeCreatePromiseResolver,
      // - Read
      putReadPromiseResolver,
      takeReadPromiseResolver,
      // - Update
      putUpdatePromiseResolver,
      takeUpdatePromiseResolver,
      // - Delete
      putDeletePromiseResolver,
      takeDeletePromiseResolver,
    }

    // Interface (methods and flags)
    const _interface = generateRestInterface(controllerHookContext)

    // Derivations
    // Deconstruct request results from state
    const { receivedResults: requestResultList } = state

    // Effects
    // - Observe received results & resolve promises
    useEffect(() => {
      // Find request result that belongs to this hook
      const matchedRequestResult =
        requestResultList.find(
          (receivedResult) => receivedResult.hookKey === hookKey
        ) ?? null

      // Do nothing if no matched request found
      if (matchedRequestResult === null) {
        return
      }

      // Deconstruct matched result
      const {
        requestKey: matchedRequestKey,
        method: matchedRequestMethod,
        status: matchedRequestResultStatus,
        message: matchedRequestResultMessage,
        payload: matchedRequestResultPayload,
      } = matchedRequestResult

      // Resolve promise
      switch (matchedRequestMethod) {
        // Create Operation
        case 'post': {
          // Contextualize payload
          const matchedCreateRequestResultPayload = matchedRequestResultPayload as RestCreatePayload<CompositeIdentifierType>
          const resourceIdentifier: CompositeIdentifierType | null = matchedCreateRequestResultPayload

          // Take create promise resolver
          const createPromiseResolver = takeCreatePromiseResolver(
            matchedRequestKey
          )

          // Deconstruct create promise resolver
          const { resolve: resolveCreatePromise } = createPromiseResolver

          // Construct create operation result
          const createOperationResult: RestCreateResult<CompositeIdentifierType> = {
            status: matchedRequestResultStatus,
            message: matchedRequestResultMessage,
            compositeIdentifier: resourceIdentifier,
          }

          // Resolve create operation promise
          resolveCreatePromise(createOperationResult)
        }
        // Read Operation
        case 'get': {
          // Contextualize payload
          const matchesReadRequestResultPayload = matchedRequestResultPayload as RestReadPayload<
            CompositeIdentifierType,
            AnonResourceType
          >

          // Deconstruct payload
          const { resourceList } = matchesReadRequestResultPayload

          // Take read promise resolver
          const readPromiseResolver = takeReadPromiseResolver(matchedRequestKey)

          // Deconstruct read promise resolver
          const { resolve: resolveReadPromise } = readPromiseResolver

          // Construct read operation result
          const readOperationResult: RestReadResult<
            CompositeIdentifierType,
            AnonResourceType
          > = {
            status: matchedRequestResultStatus,
            message: matchedRequestResultMessage,
            resourceList,
          }

          // Resolve read operation promise
          resolveReadPromise(readOperationResult)
        }
        // Update Operation
        case 'put': {
          // Take update promise resolver
          const updatePromiseResolver = takeUpdatePromiseResolver(
            matchedRequestKey
          )

          // Deconstruct update promise resolver
          const { resolve: resolveUpdatePromise } = updatePromiseResolver

          // Construct update operation result
          const updateOperationResult: RestUpdateResult = {
            status: matchedRequestResultStatus,
            message: matchedRequestResultMessage,
          }

          // Resolve update operation promise
          resolveUpdatePromise(updateOperationResult)
        }
        // Delete Operation
        case 'delete': {
          // Take delete promise resolver
          const deletePromiseResolver = takeDeletePromiseResolver(
            matchedRequestKey
          )

          // Deconstruct delete promise resolver
          const { resolve: resolveDeletePromise } = deletePromiseResolver

          // Construct delete operation result
          const deleteOperationResult: RestDeleteResult = {
            status: matchedRequestResultStatus,
            message: matchedRequestResultMessage,
          }

          // Resolve delete operation promise
          resolveDeletePromise(deleteOperationResult)
        }
        // Unrecognized Method
        default: {
          throw new Error(
            `Cannot resolve REST operation promise. ` +
              `Unrecognized request method '${matchedRequestMethod}'.`
          )
        }
      }
    }, [
      requestResultList
        .map(({ requestKey }) => requestKey)
        .reduce<string>((concatenatedKeys, requestKey) => {
          if (concatenatedKeys === '') return `${requestKey}`
          return `${concatenatedKeys}-${requestKey}`
        }, ''),
    ])
    // - Clean up on dismount
    useEffect(() => {
      return () => {
        handleControllerHookDismount(controllerHookContext)
      }
    }, [])

    return _interface
  }

  return useRestResource
}

export default generateControllerHook
