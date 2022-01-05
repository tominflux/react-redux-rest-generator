import generateRestInterface from './generateRestInterface'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import flattenPrimitiveObjectArray from '../../utils/flattenObjectArray'
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
} from '../../types'
import { Dispatch } from 'redux'
import handleDismount from '../generateRestControllerHook/events/handleDismount'
import { RestHookContext } from './types'
import handleProcessRequest from '../generateRestControllerHook/events/handleProcessRequest'

const generateRestHook: RestHookGenerator = <
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
    const takeReadPromiseResolver = (key: string) =>
      takeRequestPromiseResolver(
        key,
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

    // Put together hook context
    const hookContext: RestHookContext<
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
      if (state.fetching) return
      if (state.key !== null) {
        // console.error(error)
        throw new Error(
          `R3G - ${resourceConfig.name} - Not currently fetching but request key is not null.`
        )
      }

      handleProcessRequest(hookContext)
    }, [
      state.fetching,
      state.pendingRequests
        .map((request) => request.key)
        .reduce((accumulator, current) => `${accumulator}-${current}`, ''),
    ])
    // - Clean up on dismount
    useEffect(() => {
      return () => {
        handleDismount(hookContext)
      }
    }, [])

    return _interface
  }

  return useRestResource
}

export default generateRestHook
