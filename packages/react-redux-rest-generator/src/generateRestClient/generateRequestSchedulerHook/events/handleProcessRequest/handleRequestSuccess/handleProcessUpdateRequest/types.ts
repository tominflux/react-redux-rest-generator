import { RestRequest } from '../../../../../generateRestRedux/types'
import {
  RestUpdateResult,
  RestUpdatePromiseResolver,
  RestControllerHookContext,
} from '../../../../types'

type RestProcessUpdateRequestEventHandler = <
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
  result: RestUpdateResult,
  resolver: RestUpdatePromiseResolver
) => Promise<void>

export default RestProcessUpdateRequestEventHandler
