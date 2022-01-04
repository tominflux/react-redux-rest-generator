import {
  RestRequest,
  RestUpdatePromiseResolver,
  RestUpdateResult,
} from '../../../../../types'
import { RestHookContext } from '../../../types'

type RestProcessUpdateErrorEventHandler = <
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

export default RestProcessUpdateErrorEventHandler
