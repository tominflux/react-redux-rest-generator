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
  resourceListName: string
  resourceIdentifierKeys: Array<string>
  resourcePropertyKeys: Array<string>
  method: R3gRequestMethod
  url: string
  body: string | null
}
export type ExecuteAxiosRequestOperation = <ResourceIdentifier, ResourceBody>(
  params: ExecuteAxiosRequestOperationParams
) => Promise<R3gRequestResult<ResourceIdentifier, ResourceBody>>

/*********************************/
/************  Hook  *************/
/*********************************/

// Hook: Generic Request Scheduler
export type R3gGenericRequestSchedulerHook = <
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
) => void
