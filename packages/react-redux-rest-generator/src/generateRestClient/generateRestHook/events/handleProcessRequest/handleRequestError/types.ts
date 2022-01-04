import {
  RestAmbiguousPromiseResolver,
  RestAmbiguousResult,
  RestRequest,
} from '../../../../../types'
import { RestHookContext } from '../../../types'

type RestRequestErrorEventHandler = <
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
  >,
  axiosMessage: string
) => Promise<void>

export default RestRequestErrorEventHandler
