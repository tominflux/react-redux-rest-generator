import {
  R3gRequest,
  R3gRequestMethod,
  R3gRequestResult,
} from '../request/types'

export type R3gState<ResourceIdentifier, ResourceBody> = {
  fields: ResourceBody
  resourceList: Array<ResourceIdentifier & ResourceBody>
  pendingRequests: Array<R3gRequest>
  receivedResults: Array<R3gRequestResult<ResourceIdentifier, ResourceBody>>
  fetching: boolean
  requestKey: string | null
  hookKey: string | null
  method: R3gRequestMethod | null
  status: number | null
  message: string | null
  invalidationIndex: number
  resourceIdentifier: ResourceIdentifier | null
}
