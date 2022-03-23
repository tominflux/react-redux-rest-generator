import { RestRequest } from '../../../../../generateRestRedux/types'
import {
  RestControllerHookContext,
  RestDeleteResult,
  RestDeletePromiseResolver,
} from '../../../../types'

type RestProcessDeleteErrorEventHandler = <
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
  result: RestDeleteResult,
  resolver: RestDeletePromiseResolver
) => Promise<void>

export default RestProcessDeleteErrorEventHandler
