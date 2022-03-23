import { RestRequest } from '../../../../generateRestRedux/types'
import {
  RestControllerHookContext,
  RestAmbiguousResult,
  RestAmbiguousPromiseResolver,
} from '../../../types'

type RestRequestErrorEventHandler = <
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
  >,
  axiosMessage: string
) => Promise<void>

export default RestRequestErrorEventHandler
