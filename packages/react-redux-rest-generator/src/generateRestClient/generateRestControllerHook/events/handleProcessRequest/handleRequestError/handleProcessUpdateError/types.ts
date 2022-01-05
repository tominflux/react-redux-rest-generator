import { RestRequest } from '../../../../../generateRestRedux/types'
import {
  RestControllerHookContext,
  RestUpdateResult,
  RestUpdatePromiseResolver,
} from '../../../../types'

type RestProcessUpdateErrorEventHandler = <
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

export default RestProcessUpdateErrorEventHandler
