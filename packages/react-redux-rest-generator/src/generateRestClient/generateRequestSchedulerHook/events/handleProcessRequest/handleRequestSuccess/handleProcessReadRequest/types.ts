import { RestRequest } from '../../../../../generateRestRedux/types'
import {
  RestReadResult,
  RestReadPromiseResolver,
  RestControllerHookContext,
} from '../../../../types'

type RestProcessReadRequestEventHandler = <
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
  result: RestReadResult<CompositeIdentifierType, AnonResourceType>,
  resolver: RestReadPromiseResolver<CompositeIdentifierType, AnonResourceType>
) => Promise<void>

export default RestProcessReadRequestEventHandler
