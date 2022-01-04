import {
  RestRequest,
  RestUpdatePromiseResolver,
  RestUpdateResult,
} from '../../../../../types'
import { RestHookContext } from '../../../types'

type RestProcessUpdateRequestEventHandler = <
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
  result: RestUpdateResult,
  resolver: RestUpdatePromiseResolver
) => Promise<void>

export default RestProcessUpdateRequestEventHandler
