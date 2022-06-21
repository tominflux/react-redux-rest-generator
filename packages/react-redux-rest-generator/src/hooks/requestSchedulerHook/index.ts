import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from 'redux'
import { R3gResourceConfig } from '../../client/types'
import { R3gAction } from '../../redux/actions/types'
import { R3gCreatorRecord } from '../../redux/creators/types'
import { R3gState } from '../../redux/types'
import RequestSchedulerHookOperations from './operations'
import { R3gGenericRequestSchedulerHook } from './types'

const useRequestScheduler: R3gGenericRequestSchedulerHook = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: R3gResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >,
  creators: R3gCreatorRecord<CompositeIdentifierType, AnonResourceType>
) => {
  // Deconstruct: Resource config
  const {
    name: resourceName,
    identifiers: resourceIdentifiers,
    initialFields: resourceInitialFields,
  } = resourceConfig

  // Redux
  const stateName = resourceConfig.stateName ?? `${resourceConfig.name}State`
  const state = useSelector<
    Record<string | number | symbol, unknown>,
    R3gState<CompositeIdentifierType, AnonResourceType>
  >(
    (state) =>
      state[stateName] as R3gState<CompositeIdentifierType, AnonResourceType>
  )
  const dispatch = useDispatch<
    Dispatch<R3gAction<CompositeIdentifierType, AnonResourceType>>
  >()

  // Deconstruct: Redux state
  const { fetching, requestKey, pendingRequests } = state

  // Memo: First request from pending requests
  const currentRequest = useMemo(() => pendingRequests.at(0) ?? null, [
    pendingRequests,
  ])

  // Memo: Resource identifier keys
  const resourceIdentifierKeys = useMemo(
    () => Object.keys(resourceIdentifiers),
    [resourceIdentifiers]
  )

  // Memo: Resource property keys
  const resourcePropertyKeys = useMemo(
    () => Object.keys(resourceInitialFields),
    [resourceInitialFields]
  )

  // Callback: Execute request
  const executeQueuedRequest = useCallback(async () => {
    // Throw: if no request currently queued
    if (!currentRequest) {
      throw new Error(
        `R3G: Attempted to execute request when no request is queued.`
      )
    }

    // Deconstruct: queued request
    const { requestKey, hookKey, method, url, body } = currentRequest

    // Action: Flag request as being handled
    const fetchAction = creators.fetch(requestKey)
    dispatch(fetchAction)

    // Operation: Execute Axios Request
    const requestResult = await RequestSchedulerHookOperations.executeAxiosRequest<
      CompositeIdentifierType,
      AnonResourceType
    >({
      hookKey,
      requestKey,
      resourceIdentifierKeys,
      resourcePropertyKeys,
      method,
      url,
      body,
    })

    // Action: Response
    const responseAction = creators.response(requestResult)
    dispatch(responseAction)
  }, [
    creators,
    currentRequest,
    dispatch,
    resourceIdentifierKeys,
    resourcePropertyKeys,
  ])

  // Effect: Trigger queued request execution
  useEffect(() => {
    // Fail Fast: Do not execute request if already fetching
    if (fetching) return

    // Error Case: If not fetching, request key should be null
    if (requestKey !== null) {
      throw new Error(
        `R3G - ${resourceName} - Not currently fetching but request key is not null.`
      )
    }

    // Fail Fast: Do not execute request if no request is queued
    if (!currentRequest) return

    // Callback: Execute queued request
    executeQueuedRequest()
  }, [resourceName, fetching, requestKey, currentRequest, executeQueuedRequest])
}

export default useRequestScheduler
