import { RestMethod, RestRequest } from '../../types'

export type RestReduxState<CompositeIdentifierType, AnonResourceType> = {
  fields: AnonResourceType
  resourceList: Array<CompositeIdentifierType & AnonResourceType>
  pendingRequests: Array<RestRequest>
  fetching: boolean
  key: string | null
  method: RestMethod | null
  status: number | null
  message: string | null
  invalidationIndex: number
  compositeIdentifier: CompositeIdentifierType | null
}
