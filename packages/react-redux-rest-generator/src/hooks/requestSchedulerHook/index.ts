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
  ResourceIdentifier,
  ResourceBody,
  ReadParams
>(
  resourceConfig: R3gResourceConfig<
    ResourceIdentifier,
    ResourceBody,
    ReadParams
  >,
  creators: R3gCreatorRecord<ResourceIdentifier, ResourceBody>
) => {
  // Deconstruct: Resource config
  const {
    name: resourceName,
    apiPayloadResourceListName: resourceListName,
    identifiers: resourceIdentifierKeys,
    initialFields: resourceInitialFields,
  } = resourceConfig

  // Redux
  const stateName = resourceConfig.stateName
  const state = useSelector<
    Record<string | number | symbol, unknown>,
    R3gState<ResourceIdentifier, ResourceBody>
  >((state) => state[stateName] as R3gState<ResourceIdentifier, ResourceBody>)
  const dispatch = useDispatch<
    Dispatch<R3gAction<ResourceIdentifier, ResourceBody>>
  >()

  // Deconstruct: Redux state
  const { fetching, requestKey, pendingRequests } = state

  // Memo: First request from pending requests
  const currentRequest = useMemo(() => {
    const [nextRequest] = pendingRequests
    return nextRequest ?? null
  }, [pendingRequests])

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
      ResourceIdentifier,
      ResourceBody
    >({
      hookKey,
      requestKey,
      resourceListName,
      resourceIdentifierKeys: resourceIdentifierKeys as Array<string>,
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
    resourceListName,
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
