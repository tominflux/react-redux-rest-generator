import { RestRequest } from '../../../../generateRestRedux/types'
import {
  RestAmbiguousPromiseResolver,
  RestAmbiguousResult,
  RestControllerHookContext,
} from '../../../types'

type RestRequestSuccessEventHandler = <
  CompositeIdentifierType,
  AnonResourceType,
  ReadParamsType
>(
  hookContext: RestControllerHookContext<
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
