import { RestRequest } from '../../../../../generateRestRedux/types'
import {
  RestControllerHookContext,
  RestCreateResult,
  RestCreatePromiseResolver,
} from '../../../../types'

type RestProcessCreateErrorEventHandler = <
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
  result: RestCreateResult<CompositeIdentifierType>,
  resolver: RestCreatePromiseResolver<CompositeIdentifierType>
) => Promise<void>

export default RestProcessCreateErrorEventHandler
