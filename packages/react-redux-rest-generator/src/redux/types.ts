import {
  R3gRequest,
  R3gRequestMethod,
  R3gRequestResult,
} from '../request/types'

export type R3gState<CompositeIdentifierType, AnonResourceType> = {
  fields: AnonResourceType
  resourceList: Array<CompositeIdentifierType & AnonResourceType>
  pendingRequests: Array<R3gRequest>
  receivedResults: Array<
    R3gRequestResult<CompositeIdentifierType, AnonResourceType>
  >
  fetching: boolean
  requestKey: string | null
  hookKey: string | null
  method: R3gRequestMethod | null
  status: number | null
  message: string | null
  invalidationIndex: number
  compositeIdentifier: CompositeIdentifierType | null
}
