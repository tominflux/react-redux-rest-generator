import { RestRequest } from '../../../../../generateRestRedux/types'
import {
  RestCreateResult,
  RestCreatePromiseResolver,
  RestControllerHookContext,
} from '../../../../types'

type RestProcessCreateRequestEventHandler = <
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

export default RestProcessCreateRequestEventHandler
