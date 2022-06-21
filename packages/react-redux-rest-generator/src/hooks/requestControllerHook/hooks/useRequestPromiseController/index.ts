import { useCallback, useMemo, useState } from 'react'
import {
  R3gCreatePromiseResolver,
  R3gDeletePromiseResolver,
  R3gReadPromiseResolver,
  R3gRequestPromiseController,
  R3gRequestPromiseControllerHook,
  R3gUpdatePromiseResolver,
} from './types'

// Hook: Request promise controller
const useRequestPromiseController: R3gRequestPromiseControllerHook = <
  CompositeIdentifierType,
  AnonResourceType
>() => {
  // State: Create promise resolvers
  const [createPromiseResolverList, setCreatePromiseResolverList] = useState<
    Array<R3gCreatePromiseResolver<CompositeIdentifierType>>
  >([])

  // State: Read promise resolvers
  const [readPromiseResolverList, setReadPromiseResolverList] = useState<
    Array<R3gReadPromiseResolver<CompositeIdentifierType, AnonResourceType>>
  >([])

  // State: Update promise resolvers
  const [updatePromiseResolverList, setUpdatePromiseResolverList] = useState<
    Array<R3gUpdatePromiseResolver>
  >([])

  // State: Delete promise resolvers
  const [deletePromiseResolverList, setDeletePromiseResolverList] = useState<
    Array<R3gDeletePromiseResolver>
  >([])

  // Callback: Put create request promise resolver
  const putCreatePromiseResolver = useCallback(
    (
      createPromiseResolver: R3gCreatePromiseResolver<CompositeIdentifierType>
    ) => {
      setCreatePromiseResolverList((prevCreatePromiseResolverList) => {
        const nextCreatePromiseResolverList = [
          ...prevCreatePromiseResolverList,
          createPromiseResolver,
        ]
        return nextCreatePromiseResolverList
      })
    },
    []
  )

  // Callback: Take create request promise resolver
  const removeCreatePromiseResolver = useCallback((requestKey: string) => {
    // Update State: Remove resolver from list
    setCreatePromiseResolverList((prevCreatePromiseResolverList) =>
      prevCreatePromiseResolverList.filter(
        (prevCreatePromiseResolver) =>
          prevCreatePromiseResolver.requestKey !== requestKey
      )
    )
  }, [])

  // Callback: Put read request promise resolver
  const putReadPromiseResolver = useCallback(
    (
      readPromiseResolver: R3gReadPromiseResolver<
        CompositeIdentifierType,
        AnonResourceType
      >
    ) => {
      setReadPromiseResolverList((prevReadPromiseResolverList) => {
        const nextReadPromiseResolverList = [
          ...prevReadPromiseResolverList,
          readPromiseResolver,
        ]
        return nextReadPromiseResolverList
      })
    },
    []
  )

  // Callback: Take read request promise resolver
  const removeReadPromiseResolver = useCallback((requestKey: string) => {
    // Update State: Remove resolver from list
    setReadPromiseResolverList((prevReadPromiseResolverList) =>
      prevReadPromiseResolverList.filter(
        (prevReadPromiseResolver) =>
          prevReadPromiseResolver.requestKey !== requestKey
      )
    )
  }, [])

  // Callback: Put update request promise resolver
  const putUpdatePromiseResolver = useCallback(
    (updatePromiseResolver: R3gUpdatePromiseResolver) => {
      setUpdatePromiseResolverList((prevUpdatePromiseResolverList) => {
        const nextUpdatePromiseResolverList = [
          ...prevUpdatePromiseResolverList,
          updatePromiseResolver,
        ]
        return nextUpdatePromiseResolverList
      })
    },
    []
  )

  // Callback: Take update request promise resolver
  const removeUpdatePromiseResolver = useCallback((requestKey: string) => {
    // Update State: Remove resolver from list
    setUpdatePromiseResolverList((prevUpdatePromiseResolverList) =>
      prevUpdatePromiseResolverList.filter(
        (prevUpdatePromiseResolver) =>
          prevUpdatePromiseResolver.requestKey !== requestKey
      )
    )
  }, [])

  // Callback: Put delete request promise resolver
  const putDeletePromiseResolver = useCallback(
    (deletePromiseResolver: R3gDeletePromiseResolver) => {
      setDeletePromiseResolverList((prevDeletePromiseResolverList) => {
        const nextDeletePromiseResolverList = [
          ...prevDeletePromiseResolverList,
          deletePromiseResolver,
        ]
        return nextDeletePromiseResolverList
      })
    },
    []
  )

  // Callback: Take delete request promise resolver
  const removeDeletePromiseResolver = useCallback((requestKey: string) => {
    // Update State: Remove resolver from list
    setDeletePromiseResolverList((prevDeletePromiseResolverList) =>
      prevDeletePromiseResolverList.filter(
        (prevDeletePromiseResolver) =>
          prevDeletePromiseResolver.requestKey !== requestKey
      )
    )
  }, [])

  // Memo: Request promise controller
  const requestPromiseController = useMemo<
    R3gRequestPromiseController<CompositeIdentifierType, AnonResourceType>
  >(
    () => ({
      createPromiseResolverList,
      readPromiseResolverList,
      updatePromiseResolverList,
      deletePromiseResolverList,
      putCreatePromiseResolver,
      removeCreatePromiseResolver,
      putReadPromiseResolver,
      removeReadPromiseResolver,
      putUpdatePromiseResolver,
      removeUpdatePromiseResolver,
      putDeletePromiseResolver,
      removeDeletePromiseResolver,
    }),
    [
      createPromiseResolverList,
      deletePromiseResolverList,
      putCreatePromiseResolver,
      putDeletePromiseResolver,
      putReadPromiseResolver,
      putUpdatePromiseResolver,
      readPromiseResolverList,
      removeCreatePromiseResolver,
      removeDeletePromiseResolver,
      removeReadPromiseResolver,
      removeUpdatePromiseResolver,
      updatePromiseResolverList,
    ]
  )

  return requestPromiseController
}

export default useRequestPromiseController
