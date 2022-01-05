import { RestRequest } from '../../../../../generateRestRedux/types'
import {
  RestDeleteResult,
  RestDeletePromiseResolver,
  RestControllerHookContext,
} from '../../../../types'

type RestProcessDeleteRequestEventHandler = <
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

export default RestProcessDeleteRequestEventHandler
