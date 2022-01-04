import {
  RestRequest,
  RestDeleteResult,
  RestDeletePromiseResolver,
} from '../../../../../../types'
import { RestHookContext } from '../../../../types'

type RestProcessDeleteErrorEventHandler = <
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
  result: RestDeleteResult,
  resolver: RestDeletePromiseResolver
) => Promise<void>

export default RestProcessDeleteErrorEventHandler
