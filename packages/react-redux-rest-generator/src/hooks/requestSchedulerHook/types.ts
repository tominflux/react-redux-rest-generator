import { R3gResourceConfig } from '../../client/types'
import { R3gCreatorRecord } from '../../redux/creators/types'
import { R3gRequestMethod, R3gRequestResult } from '../../request/types'

/*********************************/
/*********  Operations  ***********/
/*********************************/

// Operation: Execute Axios Request
export type ExecuteAxiosRequestOperationParams = {
  hookKey: string
  requestKey: string
  resourceIdentifierKeys: Array<string>
  resourcePropertyKeys: Array<string>
  method: R3gRequestMethod
  url: string
  body: string | null
}
export type ExecuteAxiosRequestOperation = <
  CompositeIdentifierType,
  AnonResourceType
>(
  params: ExecuteAxiosRequestOperationParams
) => Promise<R3gRequestResult<CompositeIdentifierType, AnonResourceType>>

/*********************************/
/************  Hook  *************/
/*********************************/

// Hook: Generic Request Scheduler
export type R3gGenericRequestSchedulerHook = <
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
) => void
