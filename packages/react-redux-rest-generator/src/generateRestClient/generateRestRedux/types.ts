import { RestMethod } from '../../types'
import { RestResourceConfig } from '../types'
import { RestReduxInitialStateGetter } from './generateInitialStateGetter/types'
import { RestReduxActionSet } from './generateRestActions/types'
import { RestReduxCreatorSet } from './generateRestCreators/types'
import { RestReducer } from './generateRestReducer/types'

export type RestRequest = {
  requestKey: string
  hookKey: string
  method: RestMethod
  url: string
  body: string
}

export type RestCreatePayload<
  CompositeIdentifierType
> = CompositeIdentifierType | null

export type RestReadPayload<CompositeIdentifierType, AnonResourceType> = {
  resourceList: Array<CompositeIdentifierType & AnonResourceType>
}

export type RestResult<CompositeIdentifierType, AnonResourceType> = {
  requestKey: string
  hookKey: string
  status: number
  message: string
  payload:
    | RestCreatePayload<CompositeIdentifierType>
    | RestReadPayload<CompositeIdentifierType, AnonResourceType>
    | null
}

export type RestReduxState<CompositeIdentifierType, AnonResourceType> = {
  fields: AnonResourceType
  resourceList: Array<CompositeIdentifierType & AnonResourceType>
  pendingRequests: Array<RestRequest>
  receivedResults: Array<RestResult<CompositeIdentifierType, AnonResourceType>>
  fetching: boolean
  requestKey: string | null
  hookKey: string | null
  method: RestMethod | null
  status: number | null
  message: string | null
  invalidationIndex: number
  compositeIdentifier: CompositeIdentifierType | null
}

export type RestRedux<CompositeIdentifierType, AnonResourceType> = {
  actions: RestReduxActionSet
  creators: RestReduxCreatorSet<CompositeIdentifierType, AnonResourceType>
  reducer: RestReducer<CompositeIdentifierType, AnonResourceType>
  getInitialState: RestReduxInitialStateGetter<
    CompositeIdentifierType,
    AnonResourceType
  >
}

export type RestReduxGenerator = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  resourceConfig: RestResourceConfig<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >
) => RestRedux<CompositeIdentifierType, AnonResourceType>
