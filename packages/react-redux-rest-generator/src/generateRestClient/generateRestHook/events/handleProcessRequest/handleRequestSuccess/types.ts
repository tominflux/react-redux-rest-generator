import {
  RestAmbiguousPromiseResolver,
  RestAmbiguousResult,
  RestRequest,
} from '../../../../../types'
import { RestHookContext } from '../../../types'

type RestRequestSuccessEventHandler = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestHookContext<
    CompositeIdentifierType,
    AnonResourceType,
    ReadParamsType
  >,
  request: RestRequest,
  result: RestAmbiguousResult,
  resolver: RestAmbiguousPromiseResolver<
    CompositeIdentifierType,
    AnonResourceType
  >
) => Promise<void>

export default RestRequestSuccessEventHandler
